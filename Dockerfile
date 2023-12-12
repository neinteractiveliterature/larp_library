ARG RUBY_VERSION
ARG NODE_VERSION

### dev

FROM ruby:${RUBY_VERSION}-slim as dev
ARG NODE_VERSION

USER root
RUN useradd www
WORKDIR /usr/src/larp_library

RUN apt-get update && apt-get install -y git build-essential shared-mime-info libpq-dev && rm -rf /var/lib/apt/lists/*

COPY --chown=www:www Gemfile Gemfile.lock .ruby-version /usr/src/larp_library/
RUN bundle config set without 'development test' \
  && bundle install -j4 \
  && echo 'Running bundle clean --force' \
  && bundle clean --force \
  && echo 'Copying /usr/local/bundle to /usr/local/bundle-tmp' \
  && cp -R /usr/local/bundle /usr/local/bundle-tmp \
  && echo 'Cleaning cached gems and intermediate build files from /usr/local/bundle-tmp' \
  && rm -rf /usr/local/bundle-tmp/cache/*.gem \
  && find /usr/local/bundle-tmp/gems -name '*.c' -delete \
  && find /usr/local/bundle-tmp/gems -name '*.o' -delete \
  && echo 'Switching the bundle directory for the cleaned one, Raiders of the Lost Ark-style' \
  && rm -rf /usr/local/bundle \
  && mv /usr/local/bundle-tmp /usr/local/bundle

COPY --chown=www:www . /usr/src/larp_library

### build

FROM dev AS build

ENV RAILS_ENV production
ENV NODE_ENV production
ENV AWS_ACCESS_KEY_ID dummy
ENV AWS_SECRET_ACCESS_KEY dummy

RUN DATABASE_URL=postgresql://fakehost/not_a_real_database AWS_S3_BUCKET=fakebucket ASSETS_HOST=fakehost SECRET_KEY_BASE=fakekey bundle exec rails assets:precompile

### ld_preload trickery

FROM ruby:${RUBY_VERSION}-slim as amd64_jemalloc
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2

FROM ruby:${RUBY_VERSION}-slim as arm64_jemalloc
ENV LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libjemalloc.so.2

### production

FROM ${TARGETARCH}_jemalloc as production
ARG NODE_VERSION
ARG TARGETARCH
ARG REVISION

ENV RAILS_ENV production
ENV NODE_ENV production
ENV REVISION ${REVISION}

USER root
RUN useradd -ms /bin/bash www
RUN apt-get update && apt-get install -y --no-install-recommends libjemalloc2 shared-mime-info libpq5 && rm -rf /var/lib/apt/lists/*

COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build --chown=www /usr/src/larp_library /usr/src/larp_library
WORKDIR /usr/src/larp_library

USER www
CMD bundle exec bin/rails server -p $PORT -b 0.0.0.0
