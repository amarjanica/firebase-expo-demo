import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvConfigService } from './config/env-config.service';
import { EventAdapter } from './event/event.adapter';
import { FirebaseService } from './firebase/firebase.service';
import { ErrorsFilter } from './errors';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(EnvConfigService);
  app.useWebSocketAdapter(new EventAdapter(app, app.get(FirebaseService)));
  app.useGlobalFilters(new ErrorsFilter());
  app.enableCors({
    origin: ['http://localhost:8081'],
    credentials: true,
  });
  app.set('trust proxy', 'loopback');
  const config = new DocumentBuilder()
    .setTitle('API Spec')
    .setDescription('Demo API for firebase-expo-demo app')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customJs: [
      'https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth-compat.js',
    ],
    customJsStr: `
    (function() {
      function initFirebaseAuth() {
        console.log('Init firebase auth')
        var firebaseConfig = {
          apiKey: "${configService.get('FB_API_KEY')}",
          authDomain: "${configService.get('FB_AUTH_DOMAIN')}",
          projectId: "${configService.get('FB_PROJECT_ID')}"
        };
        firebase.initializeApp(firebaseConfig);

        var auth = firebase.auth();
        var provider = new firebase.auth.GoogleAuthProvider();

        var bar = document.createElement('div');
        bar.innerHTML = '<button id="login">Sign in with Google</button>'
                      + '<button id="logout" style="display:none">Sign out</button>'
                      + '<span id="user" style="margin-left:8px;"></span>';
        bar.style.cssText = 'display:flex;gap:12px;align-items:center;padding:10px 16px;border-bottom:1px solid #eee;';
        document.body.insertBefore(bar, document.body.firstChild);

        var loginBtn = document.getElementById('login');
        var logoutBtn = document.getElementById('logout');
        var userSpan = document.getElementById('user');

        window.__idToken = null;

        loginBtn.onclick = function() { auth.signInWithPopup(provider); };
        logoutBtn.onclick = function() { auth.signOut(); };

        auth.onAuthStateChanged(function(user) {
          if (user) {
            user.getIdToken().then(function(t) {
              window.__idToken = t;
            });
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            userSpan.textContent = 'Signed in as ' + (user.email || user.uid);
          } else {
            window.__idToken = null;
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            userSpan.textContent = '';
          }
        });
      }
      function attachInterceptor() {
          if (!window.ui) return;

          const system = window.ui.getSystem();
          if (!system || !system.fn || !system.fn.fetch) return;

          const origFetch = system.fn.fetch;

          system.fn.fetch = (req) => {
            const token = window.__idToken;
            console.log('Token found', token)

            if (token) {
              if (!req.headers) req.headers = {};
              req.headers["Authorization"] = "Bearer " + token;
            }

            return origFetch(req);
          };

          console.log("Swagger interceptor attached");
        }

        function waitForUi() {
          if (window.ui && window.ui.getSystem) {
            attachInterceptor();
          } else {
            setTimeout(waitForUi, 300);
          }
        }

        initFirebaseAuth();
        waitForUi()
    })();
  `,
  });

  await app.listen(configService.get('PORT'));
}
bootstrap();
