from locust import HttpLocust, TaskSet, task
import datetime
import json

class UserBehavior(TaskSet):

    user = {
        "_id": "test",
        "createdAt": datetime.datetime.now(),
        "fullName": "John Doe",
        "birthDate": datetime.datetime.now(),
        "cnhExpiration": datetime.datetime.now(),
        "email": "john@mail.com",
        "password": "john123"
    }
            
    car = {
        "createdAt": datetime.datetime.now(),
        "owner": user,
        "brand": "Volkswagen",
        "model": "Gol",
        "year": "2018",
        "plate": "XXX-1999",
        "odometer": 10000
    }

    car2 = {
        "createdAt": datetime.datetime.now(),
        "owner": user,
        "brand": "Ford",
        "model": "Focus",
        "year": "2018",
        "plate": "XXX-0000",
        "odometer": 2       
    }

    auth_header = {}


    def on_start(self):
        self.login()
        

    def login(self):
        response = self.client.post("/login", {
            "email": 'admin@email.com',
            "password": 'eutenhoumviolaorosa'
        }, catch_response=True)
        token = response.json()["token"]
        self.auth_header = { "Authorization": "bearer " + token }

    # @task(2)
    # def service_list(self):
    #     self.client.get("/car", headers=auth_header)

    # @task
    # def service_register(self):
    #     self.client.post("/car", car, headers=auth_header)
    
    @task(4)
    def user_list(self):
        self.client.get("/user", headers=self.auth_header)

    @task(2)
    def user_register(self):
        response = self.client.post("/user",
            data=self.user,
            headers=self.auth_header,
            catch_response=True)
        if response.ok:
            user_id = response.json()['_id']
            self.client.delete("/user/" + user_id, headers=self.auth_header)
    
    @task(4)
    def car_list(self):
        self.client.get("/car", headers=self.auth_header)

    @task(2)
    def car_register(self):
        response = self.client.post("/car",
            data=self.car,
            headers=self.auth_header,
            catch_response=True)
        if response.ok:
            car_id = response.json()['_id']
            self.client.delete("/car/" + car_id, headers=self.auth_header)

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000/car/5b5284fc0011b21b0cfb03cd 	1 	0 	6 	6 	6 	6 	0 	0
    max_wait = 9000DELETE 	/car/5b5284fd0011b21b0cfb03ce 	