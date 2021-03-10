FROM ubuntu:latest
VOLUME /golem/work /golem/output /golem/resource
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get -qq -y install curl
RUN apt install -y wget
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get update
RUN apt-get -qq -y install nodejs
RUN npm i -g yarn
#commenting these out since we're going to manually install a specific version now
# RUN mkdir -p $HOME/.local/share/ya-installer/terms
# RUN touch $HOME/.local/share/ya-installer/terms/testnet-01.tag
# RUN curl -sSf https://join.golem.network/as-requestor | bash - || echo "Nothing to see here"
# ENV PATH=${PATH}:/root/.local/bin/:/root/.local/
RUN wget https://github.com/golemfactory/yagna/releases/download/v0.6.1/golem-requestor-linux-v0.6.1.tar.gz
RUN tar -xf golem-requestor-linux-v0.6.1.tar.gz
RUN cp golem-requestor-linux-v0.6.1/* /usr/sbin/
WORKDIR /golem/work
# Start up in background and keep running
# docker run -d -it --name=diska --rm -v ${PWD}:/golem/work golem-slate tail -f /dev/null
#
# run the codepen
# docker exec -it -w /golem/work diskOne bash -C ./run.sh