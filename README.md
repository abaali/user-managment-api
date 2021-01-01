# what is it ?

A simple user managment api
demo : https://authservernodejs.herokuapp.com/

# Usage:

### Clone the repository:

```
git clone https://github.com/abaali/user-managment-api.git
```

### Install dependencies:

```
yarn install
```

or

```
npm install
```

### Build and start:

```
yarn build
```

then

```
yarn start
```

### Start the development server:

```
yarn dev
```

### Deploy the app to heroku

[Instructions](https://devcenter.heroku.com/articles/deploying-nodejs)

# API:

---

| Request type |          path          |                Parameters |      in |
| ------------ | :--------------------: | ------------------------: | ------: |
| _POST_       |      `/api/login`      |           email, password |    body |
| _POST_       |    `/api/register`     | email, username, password |    body |
| _POST_       | `/api/isauthenticated` |                      auth | headers |
| _POST_       |  `/api/isauthorized`   |         auth, role(admin) |  header |
| _GET_        |      `/api/users`      |                      none |    none |
| _GET_        |    `/api/user/:id`     |                        id |    path |
| _PUT_        |    `/api/user/:id`     |                        id |    path |
| _DELETE_     |    `/api/user/:id`     |                        id |    path |
