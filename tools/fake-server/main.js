const http = require('http');
const url = require('url');

const Users = require('./users.js');
const Events = require('./events.js');

const Time = require('./time.js');

console.log('Fake server start!');

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('readable', () => {
      let d = request.read();
      if (d !== null) {
        body += d;
      }
    });
    request.on('end', () => resolve(body));
  });
}

function getLoggedInUser(request) {
  let cookies = {};
  let cookieString = request.headers.cookie;
  if (cookieString) {
    cookieString.split(';').forEach(pair => {
      let [key, value] = pair.split('=');
      cookies[key.trim()] = decodeURIComponent(value);
    });
  }
  if (cookies.userId) {
    let userId = null;
    try {
      userId = Number.parseInt(cookies.userId);
    } catch (e) {}
    if (userId !== null) {
      let user = Users.getUserById(userId);
      if (user) {
        return user;
      }
    }
  }
  return undefined;
}

function logInUser(response, user) {
  response.setHeader('Set-Cookie', `userId=${user.id}; Path=/`);
}

function logOutUser(response) {
  response.setHeader('Set-Cookie', 'userId=; Path=/; Max-Age=0');
}

function getQueryParams(request) {
  let params = {};

  let [, query] = request.url.split('?');
  if (query) {
    query.split('&').forEach(pair => {
      let [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    })
  }

  return params;
}

function cloneObject(obj) {
  return Object.assign({}, obj);
}


http.createServer(handleRequest).listen(8000);

let requestHandlers = [
  { url: /^\/api\/users\/(\w+)$/, method: /^GET$/, handler: userProfileHandler },
  { url: /^\/api\/users\/(\w+)\/login-session$/, method: /^(PUT|DELETE)$/, handler: userLoginSessionHandler },
  { url: /^\/api\/users\/(\w+)\/events$/, method: /^(GET)$/, handler: userEventsHandler },

  { url: /^\/api\/events\/(\d+)$/, method: /^(DELETE)$/, handler: eventsDeleteHandler },

  { url: /^\/api\/tutors[^\/]*$/, method: /^(GET)$/, handler: tutorsHandler },
  { url: /^\/api\/tutors\/(\w+)$/, method: /^(GET)$/, handler: tutorProfileHandler },

  { url: /^\/api\/users\/(\w+)\/tutorials$/, method: /^(POST)$/, handler: usersTutorialsHandler },

  { handler: defaultHandler },
];

function handleRequest(request, response) {
  for (let config of requestHandlers) {
    let matches;
    if ('url' in config && !(matches = config.url.exec(request.url))) continue;
    if ('method' in config && !config.method.test(request.method)) continue;
    
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    config.handler(request, response, matches);
    break;
  }
}

function defaultHandler(request, response) {
  response.statusCode = 404;
  response.write('This is the fake server');
  response.end();
}

function userProfileHandler(request, response, matches) {
  let body;
  let user = getLoggedInUser(request);
  if (user) {
    body = {
      data: user
    };
  } else {
    response.statusCode = 401;
    body = {
      error: {
        message: 'Not logged in'
      }
    };
  }
  response.write(JSON.stringify(body));
  response.end();
}



async function userLoginSessionHandler(request, response, matches) {
  let user = getLoggedInUser(request);

  if (request.method === 'PUT') {
    let username = matches[1];
    let password = JSON.parse(await readBody(request)).password;

    if (user) logOutUser(response);

    user = Users.getUserByUsernameAndPassword(username, password);
    if (user) logInUser(response, user);

    let reply;
    if (user) {
      reply = {
        data: user
      };
    } else {
      reply = {
        error: {
          message: 'Wrong password!'
        }
      };
      response.statusCode = 401;
    }
    response.write(JSON.stringify(reply))
    response.end();

  } else {
    if (user) logOutUser(response);
    let reply = {
      data: {
        message: 'Loggout out!'
      }
    }
    response.write(JSON.stringify(reply));
    response.end();
  }
}



function userEventsHandler(request, response, matches) {
  let user = getLoggedInUser(request);
  let reply;
  if (user) {
    let events = Events.getEventsOfUser(user);
    events = events.map(e => cloneObject(e));
    events.filter(e => e.type === 'tutorial').forEach(e => {
      e.tutor = Users.getUserById(e.tutorId);
      e.student = Users.getUserById(e.studentId);
    });
    reply = {
      data: events
    };
  } else {
    reply = {
      error: {
        message: 'Not Authenticated!'
      }
    };
    response.statusCode = 401;
  }
  response.write(JSON.stringify(reply));
  response.end();
}



function eventsDeleteHandler(request, response, matches) {
  let user = getLoggedInUser(request);
  if (!user) {
    response.write(JSON.stringify({
      error: 'Not Authenticated!'
    }));
    response.end();
    return;
  }

  let id;
  try {
    id = Number.parseInt(matches[1]);
  } catch (e) {
    id = -1;
  }

  let event = null;
  if (id >= 0) {
    event = Events.getEventsOfUser(user).find(e => e.id === id);
  }

  let reply;
  if (event) {
    event.cancelled = true;
    reply = {
      data: {
        message: 'success'
      }
    };
  } else {
    reply = {
      error: {
        message: `Cannot find event with id "${id}", maybe it is deleted?`
      }
    }
    response.statusCode = 404;
  }
  response.write(JSON.stringify(reply));
  response.end();
}


function tutorsHandler(request, response, matches) {
  let user = getLoggedInUser(request);
  if (!user) {
    response.write(JSON.stringify({
      error: 'Not Authenticated!'
    }));
    response.end();
    return;
  }
  
  let params = getQueryParams(request);

  let tutors = Users.getTutors(params);

  let reply = {
    data: tutors
  };

  response.write(JSON.stringify(reply));
  response.end();
}

function tutorProfileHandler(request, response, matches) {
  let user = getLoggedInUser(request);
  if (!user) {
    response.write(JSON.stringify({
      error: 'Not Authenticated!'
    }));
    response.end();
    return;
  }
  
  let username = matches[1];

  let tutor;
  if (username) {
    tutor = Users.getTutorByUsername(username);
  }

  if (tutor) {
    tutor = cloneObject(tutor);
    tutor.events = [...new Set([...Events.getEventsOfUser(tutor), ...Events.getEventsOfUser(user)])];
  }

  let reply;
  if (tutor) {
    reply = {
      data: tutor
    };
  } else {
    reply = {
      error: {
        message: `Cannot find tutor "${username}"`
      }
    };
    response.statusCode = 404;
  }

  response.write(JSON.stringify(reply));
  response.end();
}


async function usersTutorialsHandler(request, response) {
  let user = getLoggedInUser(request);
  if (!user) {
    response.write(JSON.stringify({
      error: 'Not Authenticated!'
    }));
    response.end();
    return;
  }

  let params = JSON.parse(await readBody(request));

  let startTime = new Date(params.startTime);
  let endTime = new Date(params.endTime);

  let valid = true;

  let tutor = Users.getTutorByUsername(params.tutorUsername);
  valid = valid && Boolean(tutor);

  if (valid) {
    if (tutor.type === 'contracted') {
      valid = (startTime.getMinutes() === 30 || startTime.getMinutes() === 0)
              && (endTime - startTime) === Time.getTimeDelta(0, 30);
    } else {
      valid = (startTime.getMinutes() === 0)
              && (endTime - startTime) === Time.getTimeDelta(1, 0);
    }
  }
  valid = valid && ((startTime - new Date()) >= Time.getTimeDelta(24, 0));

  valid = valid && Events.getEventsOfUser(user).filter(event => {
    let begin = new Date(event.startTime);
    let end = new Date(event.endTime);
    return begin < endTime && end > startTime;
  }).length == 0;

  valid = valid && Events.getEventsOfUser(tutor).filter(event => {
    let begin = new Date(event.startTime);
    let end = new Date(event.endTime);
    return begin < endTime && end > startTime;
  }).length == 0;

  let tutorFee;
  if (valid && tutor.type === 'private') {
    tutorFee = Number.parseFloat(tutor.hourlyRate) * (endTime - startTime) / Time.getTimeDelta(1, 0);
  } else {
    tutorFee = 0;
  }

  let commissionFee = tutorFee * 0.05;

  let couponDiscount;
  if (params.couponCode) {
    couponDiscount = -commissionFee;
  } else {
    couponDiscount = 0;
  }

  let total = tutorFee + commissionFee + couponDiscount;

  let reply;
  if (valid) {

    reply = {
      data: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        balance: user.wallet.balance.toString(),
        tutorFee: tutorFee.toString(),
        commissionFee: commissionFee.toString(),
        couponDiscount: couponDiscount.toString(),
        total: total.toString()
      }
    };

    if (!params.preview) {
      Events.addEvent({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        type: 'tutorial',
        studentId: user.id,
        tutorId: tutor.id
      });
      user.wallet.balance -= total;
    }

  } else {
    reply = {
      error: {
        message: 'Invalid Time'
      }
    };
    response.statusCode = 405;
  }

  response.write(JSON.stringify(reply));
  response.end();
}
