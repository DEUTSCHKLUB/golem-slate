FROM ubuntu:latest
VOLUME /golem/work /golem/output /golem/resource
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get -qq -y install curl
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get update
RUN apt-get -qq -y install nodejs
RUN npm i -g yarn
RUN mkdir -p $HOME/.local/share/ya-installer/terms
RUN touch $HOME/.local/share/ya-installer/terms/testnet-01.tag
RUN curl -sSf https://join.golem.network/as-requestor | bash - || echo "Nothing to see here"
ENV PATH=${PATH}:/root/.local/bin/:/root/.local/
WORKDIR /golem/work
# Start up in background and keep running
# docker run -d -it --name=diska --rm -v ${PWD}:/golem/work golem-slate tail -f /dev/null
#
# run the codepen
# docker exec -it -w /golem/work diskOne bash -C ./run.sh