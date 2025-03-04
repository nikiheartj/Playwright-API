import { test, expect } from '@playwright/test';
import exp from 'constants';

let token; //токен для авторизации
let xAuthToken;//токен который не в памяти для теста "PUT /challenger/guid CREATE"

test.describe('API Challenges', () => {
  test.beforeAll('POST token (201)', async ({ request }) => {
    const response = await request.post('/challenger');
    expect(response.status()).toBe(201);
    const HEADERS = await response.headers();
    token = HEADERS['x-challenger'];
    console.log(token);
  });

  test('GET challenges (200)', async ({ request }) => {
    const response = await request.get('/challenges', {
      headers: {
        'x-challenger': token,
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    // console.log(body);
    expect(body.challenges.length).toEqual(59);
    // console.log(body.challenges.length);
  });

  test('GET /todos (200)', async ({ request }) => {
    const response = await request.get('/todos', {
      headers: {
        'x-challenger': token,
      }
    });
    const body = await response.json();
    
    expect(response.status()).toBe(200);
    expect(body.todos.length).toEqual(10);
  });

  test('GET /todo (404) not plural', async ({ request }) => {
    const response = await request.get('/todo', {
      headers: {
        'x-challenger': token,
      }
    });
    expect(response.status()).toBe(404);
  });

  test('GET /todos/{id} (200)', async ({ request }) => {
    const response = await request.get('/todos/3', {
      headers: {
        'x-challenger': token,
      }
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos).toEqual(expect.arrayContaining([
      expect.objectContaining({
          id: 3,
          title: 'process payments',
          doneStatus: false,
          description: ''
        })
      ]));
  });

  test('GET /todos/{id} (404)', async ({ request }) => {
    const response = await request.get('/todos/33', {
      headers: {
        'x-challenger': token,
      }
    });
    expect(response.status()).toBe(404);
  });

  test('HEAD /todos (200)', async ({ request }) => {
    const response = await request.head('/todos', {
      headers: {
        'x-challenger': token,
      }
    });
    expect(response.status()).toBe(200);
    const HEADERS = await response.headers();
    // console.log(HEADERS);
  });

  test('POST /todos (201)', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'QA check',
        doneStatus: true,
        description: 'QA check'
      }
    });
    const DATA = JSON.parse(await response.text());
    // console.log(DATA);
    expect(response.status()).toBe(201);
    expect(DATA.title).toEqual('QA check');
    expect(DATA.doneStatus).toEqual(true);
    expect(DATA.description).toEqual('QA check');
  });

  test('POST /todos (400) doneStatus', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'QA check1',
        doneStatus: 3,
        description: 'QA check1'
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body).toHaveProperty('errorMessages', ['Failed Validation: doneStatus should be BOOLEAN but was NUMERIC']);
  });

  test('POST /todos (400) title too long', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'too long title too long title too long title too long title',
        doneStatus: true,
        description: 'QA check2'
      }
    });
    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toEqual(expect.arrayContaining(['Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50']));
  });

  test('	POST /todos (400) description too long', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'Title',
        doneStatus: true,
        description: 'Too long description Too long description Too long description Too long description Too long description Too long description Too long description Too long description Too long description Too long description Too long description Too long description Too l'
      }
    });
    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toEqual(['Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200']);
    // console.log(body);
  });

  test('POST /todos (201) max out content', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'Full title length Full title length Full title len',
        doneStatus: true,
        description: 'Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full des'
      }
    });
    const body = await response.json();
    expect(body.title.length).toBeLessThanOrEqual(50);
    expect(body.description.length).toBeLessThanOrEqual(200);
    expect(response.status()).toBe(201);
    // console.log(body);
  });

  test('POST /todos (413) content too long', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'Full title length Full title length Full title len',
        doneStatus: true,
        description: 'Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full des Full description length Full description length Full des Full description length Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full desFull description length Full description length Full description length Full description length Full description length Full description length Full description length Full description length Full des Full description length Full description length Full des Full description length Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full description length Full des Full descrip'
      }
    });
    const body = await response.json();
    expect(body.errorMessages).toEqual(expect.arrayContaining(['Error: Request body too large, max allowed is 5000 bytes']));
    expect(response.status()).toBe(413);
    // console.log(body);
  });

  test('POST /todos (400) extra', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'Full title length Full title length Full title len',
        doneStatus: true,
        description: '',
        tags: {
          badge: 1,
          New: 'satisfies'
        }
      }
    });
    const body = await response.json();
    expect(body.errorMessages).toEqual(expect.arrayContaining(['Could not find field: tags']));
    expect(response.status()).toBe(400);
    // console.log(body);
  });

  test('PUT /todos/{id} full (200)', async ({ request }) => {
    const response = await request.put('/todos/1', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'Put Method',
        doneStatus: true,
        description: 'Put Method',
      }
    });
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining(
      {
        title: 'Put Method',
        doneStatus: true,
        description: 'Put Method'
      }
    ));
    expect(response.status()).toBe(200);
  });

  test('PUT /todos/{id} partial (200)', async ({ request }) => {
    const response = await request.put('/todos/1', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'Put Method Partly2',
      }
    });
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining(
      {
        title: 'Put Method Partly2',
      }
    ));
    expect(response.status()).toBe(200);
  });

  test('PUT /todos/{id} no title (400)', async ({ request }) => {
    const response = await request.put('/todos/1', {
      headers: {
        'x-challenger': token,
      },
      data: {
        doneStatus: true
      }
    });
    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toEqual(expect.arrayContaining([ 'title : field is mandatory' ]));
  });

  test('PUT /todos/{id} no amend id (400)', async ({ request }) => {
    const response = await request.put('/todos/1', {
      headers: {
        'x-challenger': token,
      },
      data: {
        id: 2,
        title: 'Put Method',
        doneStatus: true
      }
    });
    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toEqual(expect.arrayContaining([ 'Can not amend id from 1 to 2' ]));
  });

  test('PUT /todos/{id} (400)', async ({ request }) => {
    const response = await request.put('/todos/33', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'Put Method for creating entity',
        doneStatus: true
      }
    });
    const body = await response.json();
    // console.log(body);
    expect(response.status()).toBe(400);
    expect(body.errorMessages).toEqual(expect.arrayContaining([ 'Cannot create todo with PUT due to Auto fields id' ]));
  });

  test('POST /todos/{id} (200)', async ({ request }) => {
    const response = await request.post('/todos/9', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'POST1',
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toEqual(expect.objectContaining({
      title: 'POST1',
    }));
  });

  test('POST /todos/{id} (404)', async ({ request }) => {
    const response = await request.post('/todos/47', {
      headers: {
        'x-challenger': token,
      },
      data: {
        title: 'POST1',
      }
    });
    const body = await response.json();
    expect(response.status()).toBe(404);
    expect(body).toHaveProperty('errorMessages', ['No such todo entity instance with id == 47 found']);
  });

  test('GET /todos (200) ?filter', async ({ request }) => {
    const response = await request.get('/todos?doneStatus=true', {
      headers: {
        'x-challenger': token,
      }
    });
    expect(response.status()).toBe(200);
    const body = JSON.parse(await response.text());
    // console.log(body);
    expect(body.todos.every(todo => todo.doneStatus === true)).toBe(true);

  });

  test('DELETE /todos/{id} (200)', async ({ request }) => {
    const response = await request.delete('/todos/1', {
      headers: {
        'x-challenger': token,
      },
    });
    expect(response.status()).toBe(200);
  });

  test('GET /todos (200) XML', async ({ request }) => {
    const response = await request.get('/todos', {
      headers: {
        'x-challenger': token,
        'accept': 'application/xml'
      },
    });
    const headers = await response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toHaveProperty('content-type', 'application/xml');
  });

  test('GET /todos (200) JSON', async ({ request }) => {
    const response = await request.get('/todos', {
      headers: {
        'x-challenger': token,
        'accept': 'application/json'
      },
    });
    const headers = await response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toHaveProperty('content-type', 'application/json');
  });

  test('GET /todos (200) ANY', async ({ request }) => {
    const response = await request.get('/todos', {
      headers: {
        'x-challenger': token,
        'accept': '*/*'
      },
    });
    const headers = await response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toHaveProperty('content-type', 'application/json');
    expect(headers).toHaveProperty('x-robots-tag', 'noindex');
    expect(headers).toHaveProperty('server', 'Jetty(9.4.z-SNAPSHOT)');
  });

  test('GET /todos (200) XML pref', async ({ request }) => {
    const response = await request.get('/todos', {
      headers: {
        'x-challenger': token,
        'accept': 'application/xml, application/json'
      },
    });
    const headers = await response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toHaveProperty('content-type', 'application/xml');
  });

  test('GET /todos (200) no accept', async ({ request }) => {
    const response = await request.get('/todos', {
      headers: {
        'x-challenger': token,
        'accept': '',
      },
    });
    const headers = await response.headers();
    expect(response.status()).toBe(200);
    expect(headers).toHaveProperty('content-type', 'application/json');
  });

  test('GET /todos (406)', async ({ request }) => {
    const response = await request.get('/todos', {
      headers: {
        'x-challenger': token,
        'accept': 'application/gzip',
      },
    });
    const body = await response.json();
    expect(response.status()).toBe(406);
    expect(body).toHaveProperty('errorMessages', ['Unrecognised Accept Type']);
  });

  test('POST /todos XML', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
        'accept': 'application/xml',
        'content-type': 'application/xml'
      },
      data: `
        <todo>
          <title>XML format</title>
          <doneStatus>true</doneStatus>
          <description>file paperwork today</description>
        </todo>
      `
    });
    const headers = await response.headers();

    expect(headers).toHaveProperty('content-type', expect.stringContaining('application/xml'));
    expect(response.status()).toBe(201);
  });

  test('POST /todos JSON', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      data: {
        title: 'JSON format',
        description: 'json format only',
        doneStatus: true
      }
    });
    const body = await response.json();
    const headers = await response.headers();

    expect(headers).toHaveProperty('content-type', expect.stringContaining('application/json'));
    expect(response.status()).toBe(201);  
    expect(body).toEqual(expect.objectContaining({
      description: 'json format only',
      doneStatus: true,
      title: 'JSON format'
    }));
  });

  test('POST /todos (415)', async ({ request }) => {
    const response = await request.post('/todos', {
      headers: {
        'x-challenger': token,
        'content-type': 'popi'
      },
      data: {
        title: 'Unsupported format',
        description: 'Unsupported format',
        doneStatus: true
      }
    });
    const body = await response.json();
    expect(response.status()).toBe(415);  
    expect(body).toHaveProperty('errorMessages', [ `Unsupported Content Type - popi` ]);
  });
  
  test('GET /challenger/guid (existing X-CHALLENGER)', async ({ request }) => {
    const response = await request.get(`/challenger/${token}`, {
      headers: {
        'x-challenger': token,
      },
    });
    const body = await response.json();
    xAuthToken = body.xAuthToken;
    console.log(body)
    expect(response.status()).toBe(200);  
    expect(body).toHaveProperty('challengeStatus');
  });

  test('PUT /challenger/guid RESTORE', async ({ request }) => {
    const response = await request.put(`/challenger/${token}`, {
      headers: {
        'x-challenger': token,
      },
      data: {
        xChallenger: token,
        secretNote: '',
        challengeStatus: {
          PUT_RESTORABLE_CHALLENGER_PROGRESS_STATUS: false,
          GET_TODOS: true,
          PUT_NEW_RESTORED_CHALLENGER_PROGRESS_STATUS: false,
          POST_TODOS: true,
          OVERRIDE_PATCH_HEARTBEAT_500: false,
          POST_TODOS_TOO_LONG_DESCRIPTION_LENGTH: true,
          GET_RESTORABLE_CHALLENGER_PROGRESS_STATUS: true,
          POST_SECRET_NOTE_401: false,
          PUT_TODOS_PARTIAL_200: true,
          GET_TODOS_FILTERED: true,
          GET_TODO_404: true,
          PUT_TODOS_400_NO_AMEND_ID: true,
          GET_HEARTBEAT_204: false,
          POST_TODOS_INVALID_EXTRA_FIELD: true,
          POST_SECRET_NOTE_BEARER_200: false,
          POST_CREATE_XML_ACCEPT_JSON: false,
          GET_ACCEPT_XML_PREFERRED: true,
          POST_SECRET_NOTE_200: false,
          CREATE_NEW_CHALLENGER: true,
          POST_UPDATE_TODO: true,
          GET_CHALLENGES: true,
          GET_HEAD_TODOS: true,
          POST_SECRET_NOTE_403: false,
          GET_RESTORABLE_TODOS: false,
          GET_ACCEPT_XML: true,
          POST_TODOS_415: true,
          GET_ACCEPT_JSON: true,
          CREATE_SECRET_TOKEN_201: false,
          OVERRIDE_DELETE_HEARTBEAT_405: false,
          POST_TODOS_BAD_DONE_STATUS: true,
          GET_SECRET_NOTE_200: false,
          OVERRIDE_TRACE_HEARTBEAT_501: false,
          POST_TODOS_404: true,
          POST_CREATE_JSON_ACCEPT_XML: false,
          GET_SECRET_NOTE_BEARER_200: false,
          GET_TODO: true,
          PUT_TODOS_FULL_200: true,
          GET_ACCEPT_ANY_DEFAULT_JSON: true,
          GET_SECRET_NOTE_401: false,
          POST_MAX_OUT_TITLE_DESCRIPTION_LENGTH: true,
          POST_CREATE_JSON: true,
          PATCH_HEARTBEAT_500: false,
          DELETE_A_TODO: true,
          DELETE_ALL_TODOS: false,
          POST_TODOS_TOO_LONG_PAYLOAD_SIZE: true,
          TRACE_HEARTBEAT_501: false,
          DELETE_HEARTBEAT_405: false,
          POST_ALL_TODOS: false,
          GET_SECRET_NOTE_403: false,
          PUT_TODOS_MISSING_TITLE_400: true,
          OPTIONS_TODOS: false,
          GET_JSON_BY_DEFAULT_NO_ACCEPT: true,
          POST_TODOS_TOO_LONG_TITLE_LENGTH: true,
          PUT_RESTORABLE_TODOS: false,
          GET_TODOS_NOT_PLURAL_404: true,
          POST_CREATE_XML: true,
          CREATE_SECRET_TOKEN_401: false,
          PUT_TODOS_400: true,
          GET_UNSUPPORTED_ACCEPT_406: true
        }
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(200);  
    expect(body).toEqual(expect.objectContaining({
      xChallenger: token,
      secretNote: '',
      challengeStatus: expect.any(Object)
    }));
  });

  test('PUT /challenger/guid CREATE', async ({ request }) => {
    const response = await request.put(`/challenger/${xAuthToken}`, {
      headers: {
        'x-challenger': xAuthToken,
      },
      data: {
        xChallenger: xAuthToken,
        secretNote: '',
        challengeStatus: {
          PUT_RESTORABLE_CHALLENGER_PROGRESS_STATUS: false,
          GET_TODOS: true,
          PUT_NEW_RESTORED_CHALLENGER_PROGRESS_STATUS: false,
          POST_TODOS: true,
          OVERRIDE_PATCH_HEARTBEAT_500: false,
          POST_TODOS_TOO_LONG_DESCRIPTION_LENGTH: true,
          GET_RESTORABLE_CHALLENGER_PROGRESS_STATUS: true,
          POST_SECRET_NOTE_401: false,
          PUT_TODOS_PARTIAL_200: true,
          GET_TODOS_FILTERED: true,
          GET_TODO_404: true,
          PUT_TODOS_400_NO_AMEND_ID: true,
          GET_HEARTBEAT_204: false,
          POST_TODOS_INVALID_EXTRA_FIELD: true,
          POST_SECRET_NOTE_BEARER_200: false,
          POST_CREATE_XML_ACCEPT_JSON: false,
          GET_ACCEPT_XML_PREFERRED: true,
          POST_SECRET_NOTE_200: false,
          CREATE_NEW_CHALLENGER: true,
          POST_UPDATE_TODO: true,
          GET_CHALLENGES: true,
          GET_HEAD_TODOS: true,
          POST_SECRET_NOTE_403: false,
          GET_RESTORABLE_TODOS: false,
          GET_ACCEPT_XML: true,
          POST_TODOS_415: true,
          GET_ACCEPT_JSON: true,
          CREATE_SECRET_TOKEN_201: false,
          OVERRIDE_DELETE_HEARTBEAT_405: false,
          POST_TODOS_BAD_DONE_STATUS: true,
          GET_SECRET_NOTE_200: false,
          OVERRIDE_TRACE_HEARTBEAT_501: false,
          POST_TODOS_404: true,
          POST_CREATE_JSON_ACCEPT_XML: false,
          GET_SECRET_NOTE_BEARER_200: false,
          GET_TODO: true,
          PUT_TODOS_FULL_200: true,
          GET_ACCEPT_ANY_DEFAULT_JSON: true,
          GET_SECRET_NOTE_401: false,
          POST_MAX_OUT_TITLE_DESCRIPTION_LENGTH: true,
          POST_CREATE_JSON: true,
          PATCH_HEARTBEAT_500: false,
          DELETE_A_TODO: true,
          DELETE_ALL_TODOS: false,
          POST_TODOS_TOO_LONG_PAYLOAD_SIZE: true,
          TRACE_HEARTBEAT_501: false,
          DELETE_HEARTBEAT_405: false,
          POST_ALL_TODOS: false,
          GET_SECRET_NOTE_403: false,
          PUT_TODOS_MISSING_TITLE_400: true,
          OPTIONS_TODOS: false,
          GET_JSON_BY_DEFAULT_NO_ACCEPT: true,
          POST_TODOS_TOO_LONG_TITLE_LENGTH: true,
          PUT_RESTORABLE_TODOS: false,
          GET_TODOS_NOT_PLURAL_404: true,
          POST_CREATE_XML: true,
          CREATE_SECRET_TOKEN_401: false,
          PUT_TODOS_400: true,
          GET_UNSUPPORTED_ACCEPT_406: true
        }
      }
    });

    expect(response.status()).toBe(201);  
  });

  test('GET /challenger/database/guid (200)', async ({ request }) => {
    const response = await request.get(`/challenger/database/${token}`, {
      headers: {
        'x-challenger': token,
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(200); 
    expect(body.todos.length).toBe(13);
  });

  test('PUT /challenger/database/guid (Update)', async ({ request }) => {
    const response = await request.put(`/challenger/database/${token}`, {
      headers: {
        'x-challenger': token,
      },
      data: {
        todos: [
          {
            id: 11,
            title: '111',
            doneStatus: true,
            description: '111'
          },
          { id: 4, title: '222' },
          {
            id: 17,
            title: 'XML format333',
            doneStatus: true,
            description: '333'
          },
          { id: 3, title: '444' },
          { id: 10, title: '444' },
          { id: 9, title: 'tidy 444' },
          { id: 8, title: '444' },
          { id: 7, title: '444' },
          { id: 5, title: '444' },
          { id: 2, title: '444' },
          { id: 6, title: '444' },
          {
            id: 15,
            title: '555',
            doneStatus: true,
            description: '666'
          },
          {
            id: 18,
            title: 'JSON format 777',
            doneStatus: true,
            description: 'json format only 777'
          }
        ]
      }
    });
    
    expect(response.status()).toBe(204); 
  });
});