from locust import HttpLocust, TaskSet, task
from random import randint, choice
import datetime
import json
import string

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

    user2 = {
        "fullName": "John Doe",
        "birthDate": str(datetime.datetime(1992, 3, 3)),
        "cnhExpiration": str(datetime.datetime(2020, 1, 1)),
        "password": "john123"
    }
            
    car = {
        "createdAt": datetime.datetime.now(),
        "owner": user,
        "brand": "Volkswagen",
        "model": "Gol",
        "year": "2018",
        "odometer": 10000
    }

    auth_header = {}

    def random_string(self, length):
        return ''.join(choice(string.ascii_letters) for m in range(length))


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
    
    @task(8)
    def car_register(self):
        self.car["plate"] = "XXX-" + str(randint(1000, 9999))

        response = self.client.post("/car",
            data=self.car,
            headers=self.auth_header,
            catch_response=True)
        if response.ok:
            car_id = response.json()['_id']
            self.client.delete("/car/" + car_id, headers=self.auth_header)
        self.client.post("/logout", headers=self.auth_header)
    
    @task(4)
    def user_list(self):
        self.client.get("/user", headers=self.auth_header)
        self.client.post("/logout", headers=self.auth_header)

    @task(3)
    def user_register(self):
        self.user2["email"] = self.random_string(10) + "@mail.com"

        self.client.post("/user", self.user2)

        response = self.client.post("/login", {
            "email": self.user2["email"],
            "password": self.user2["password"]
        }, catch_response=True)

        if response.ok:
            token = response.json()["token"]
            auth_header = { "Authorization": "bearer " + token }
            self.client.delete("/user", headers=auth_header)
        
        self.client.post("/logout", headers=self.auth_header)
    
    @task(5)
    def car_list(self):
        self.client.get("/car", headers=self.auth_header)
        self.client.post("/logout", headers=self.auth_header)



class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000