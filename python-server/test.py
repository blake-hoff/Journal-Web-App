import pytest
from app import app
import os
from dotenv import load_dotenv

# run this in the venv
# then run with 'pytest test.py -s'
# the -s shows every print statement too.

# Load variables from .env file into environment
load_dotenv(verbose=True)
test_username = os.environ.get('TEST_USER_NAME')
test_password = os.environ.get('TEST_USER_PASSWORD')
test_email = os.environ.get('TEST_USER_EMAIL')

@pytest.fixture
def client():
    app.config['TESTING'] = True # for more test/debug info.
    with app.test_client() as client:
        yield client


# use auth_client as an object for other tests.
# will login using fixed credentials, yield for the tests, then log out once the tests complete.
@pytest.fixture
def auth_client(client):
    # test login on a user that I know exists.
    # this may be changed later to 'inject' a new user for testing purposes, to remain the same on ANY db file online or offline.
    # for now, this works for a local system with both the local-only database.db and authentication files.
    response_auth = client.post('/api/auth/login/', json={"username": test_username, "password": test_password})
    # print(response_auth)
    # print(type(response_auth))
    # print(response_auth.data)
    print(response_auth.json)
    token = response_auth.json["token"]
    # print(f"token: {token}")
    client.token = token
    client.header = {"Authorization": f'Bearer {token}'}
    
    yield client


def test_signup_endpoint(client):
    # test signup on a user that I know exists, while not logged in.
    signup_response = client.post('/api/auth/signup/', json={"email": test_email, "username": test_username, "password": test_password})
    print('test signup')
    print(signup_response.data)
    print(signup_response.json)
    
    assert signup_response.status_code == 202
    assert signup_response.json['success'] == False


def test_get_endpoint_valid(auth_client):
    print('types get valid')
    print("token:", auth_client.token)
    print("header:", auth_client.header)
    response = auth_client.get('/api/types/', headers=auth_client.header)
    print(response.json)
    assert response.status_code == 200
    assert response.json["success"] == True

def test_update_entry_valid(auth_client):
    id = 321
    response = auth_client.post(f'/api/update/{id}', 
                                json={"date": "2026-08-03", 
                                    "entry_name": "Lunch",
                                    "description" : "Went to the bagel store.",
                                    "type_name": "Meal"
                                    },
                                headers=auth_client.header
                                )
    print(response.json)
    assert response.status_code == 200
    assert response.json["success"] == True

def test_get_endpoint_invalid(client):
    print("get endpoint invalid")
    response = client.get('/api/types/')
    print(response)
    print(response.json)
    assert response.status_code == 401
    assert response.json["success"] == False

def test_update_entry_invalid(auth_client):
    id = 321
    response = auth_client.post(f'/api/update/{id}', 
                                json={"date": "2026-08-99", 
                                    "entry_name": "lunch",
                                    "description" : "Went to in-n-out burger",
                                    "type_name": "not a valid type"
                                    },
                                headers=auth_client.header
                                )
    print(response.json)
    assert response.status_code == 400
    assert response.json["success"] == False

def test_create_type_invalid(auth_client):
    response = auth_client.post('/api/types/create/', 
                                json={"name": "Meal"},
                                headers=auth_client.header)
    print(response.json)
    assert response.status_code == 200
    assert response.json["success"] == False

def test_delete_type_invalid(auth_client):
    # later change to retrieve the length to always select an id that does not have an entry.
    response = auth_client.delete('/api/types/delete/',
                                  json={"type_id": 50},
                                  headers=auth_client.header) 
    print(response.json)
    assert response.status_code == 404
    assert response.json["success"] == False

def test_update_type_invalid(auth_client):
    response = auth_client.post('/api/types/update/', 
                                json={"name": "Outfit", 
                                      "type_id": 1
                                      },
                                headers=auth_client.header
                                )
    print(response.json)
    assert response.status_code == 200
    assert response.json["success"] == False