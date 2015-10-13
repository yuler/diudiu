### 获取 access token 接口

URL: /oauth2/token
Action: Post
两种方式获取方式
第一种: grant_type password 用户登陆后的 API 接口操作
       username
       password
       client_id
       client_secret

       正确返回结果如下:
       {
          "access_token": "FKBHJDLOQE5kZlIG",
          "refresh_token": "oLHeSflSdV1bB4Fa",
          "expires_in": 7200,
          "token_type": "Bearer"
       }

第二种: grant_type client_credentials 用户登陆前的 API 接口操作
       client_id android
       client_secret kylin

       正确返回结果如下:
       {
          "access_token": "eurzyD0seLg5MaSx",
          "expires_in": 7200,
          "token_type": "Bearer"
       }

第三种: grant_type refresh_token
      client_id android
      client_secret kylin
      refresh_token oLHeSflSdV1bB4Fa111

      正确返回结果如下:
      {
        "access_token": "FKBHJDLOQE5kZlIG",
        "refresh_token": "oLHeSflSdV1bB4Fa",
        "expires_in": 7200,
        "token_type": "Bearer"
      }
