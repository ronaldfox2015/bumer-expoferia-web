FROM node:6.11.1-slim

ENV APP_DIR=/app

RUN curl -o- -L https://yarnpkg.com/install.sh | bash;

WORKDIR $APP_DIR/frontend

CMD ["yarn"]