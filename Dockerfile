FROM quay.io/qasimtech/mega-md:latest

WORKDIR /root/mega-md

RUN git clone https://github.com/joeljamestech/JOEL-XMD . && \
    npm install

EXPOSE 5000

CMD ["npm", "start"]
