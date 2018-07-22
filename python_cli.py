

import requests

#cliente
class client:
    token = ""
    url = ""

    def __init__(self, url):
        self.url = url

    #te autentica
    def login(self):
        headers = {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }

        payload = {
            "username": "admin",
            "password": "123456"
        }

        url = self.url + '/login'

        r = requests.post(url, data=payload, headers=headers)
        if r.status_code != 201:
            return False
        self.token = r.json()["session"]["session_id"]
        return True

    def session(self):
        headers = {
            'Authorization': self.token
        }
        payload = {}
        url = self.url + '/session'

        r = requests.get(url, data=payload, headers=headers)
        if r.status_code != 200:
            return False
        return True

    #consulta de datos
    def get(self, model, id=0, q=""):
        headers = {
            'Authorization': self.token
        }
        payload = {}
        url = self.url + '/api/' + model
        if id != 0:
            url = url + '/' + str(id)
        if q != "":
            url = url + "?q=" + q

        r = requests.get(url, data=payload, headers=headers)
        if r.status_code != 200:
            return False

        return r.json()

    def post(self, model, payload={}):
        headers = {
            'Authorization': self.token
        }
        url = self.url + '/api/' + model

        r = requests.post(url, data=payload, headers=headers)
        if not r.ok:
            return False

        return r.json()

    def patch(self, model, id=0, payload={}):
        headers = {
            'Authorization': self.token
        }
        url = self.url + '/api/' + model + "/" + str(id)

        r = requests.patch(url, data=payload, headers=headers)
        if not r.ok:
            return False

        return r.json()

    def delete(self, model, id=0):
        headers = {
            'Authorization': self.token
        }
        url = self.url + '/api/' + model + "/" + str(id)

        r = requests.delete(url, headers=headers)
        if not r.ok:
            return False

        return True


c = client('http://localhost:4000')

if c.login():
    print(c.token)
    if c.session():
        print('logged')
        #if c.get('res.partner'):
        #    print('get: ok')

        reponse = c.post('res.partner', {
            "name": "Carlos Navarrete"
        })
        if reponse:
            print('post: ok, create id: ' + str(reponse["data"]["id"]))

        if c.get('res.partner', reponse["data"]["id"]):
            print('get: ok')

        if c.patch('res.partner', reponse["data"]["id"], {
            "name": "Carlos Navarrete"
        }):
            print('patch: ok, update id: ' + str(reponse["data"]["id"]))

        if c.delete('res.partner', reponse["data"]["id"]):
            print('delete: ok, delete id: ' + str(reponse["data"]["id"]))
