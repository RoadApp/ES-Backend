from locust import HttpLocust, TaskSet, task
import datetime

class UserBehavior(TaskSet):

    user = {
        "_id": "test",
        "createdAt": datetime.datetime.now(),
        "fullName": "John Doe",
        "birthDate": datetime.datetime.now(),
        "cnhExpiration": datetime.datetime.now(),
        "email": "john@mail.com",
        "password": "john123"
    };

    car = {
        "createdAt": datetime.datetime.now(),
        "owner": user,
        "brand": "Volkswagen",
        "model": "Gol",
        "year": "2018",
        "plate": "XXX-1999",
        "odometer": 10000
    };

    car2 = {
        "createdAt": datetime.datetime.now(),
        "owner": user,
        "brand": "Ford",
        "model": "Focus",
        "year": "2018",
        "plate": "XXX-0000",
        "odometer": 2       
    };

    def on_start(self):
        self.login()

    def login(self):
        self.client.post("/login", {
            "email": 'admin@email.com',
            "password": 'eutenhoumviolaorosa'
        })

    # @task(2)
    # def index(self):
    #     self.client.get("/")

    # @task(1)
    # def profile(self):
    #     self.client.get("/profile")

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000