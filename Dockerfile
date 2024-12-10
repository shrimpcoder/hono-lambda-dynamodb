FROM public.ecr.aws/lambda/nodejs:20

ENV ENV=development

COPY . .
RUN npm install
RUN npm run build

CMD ["dist/index.handler"] 