# Image Analyzer

This is an simple exemple of  two aws services ([rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html) and [translate](https://docs.aws.amazon.com/translate/latest/dg/what-is.html)).The service will analyze the submitted url with aws rekognition and translated it.

## Usage
 to use the this service you will need an account on aws and serverless framework.

### Deployment

In order to deploy the example, you need to run the following command:

```
$ sls deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-project-dev (112s)

functions:
  analyze: image-analyzer-dev-analyze (15 MB)
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
sls invoke --function analyze -p request.json
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "[\"99.33 de ser Cachorro\",\"99.33 de ser Animal de estimação\",\"99.33 de ser Canino\",\"99.33 de ser Mamífero\",\"91.36 de ser Pug\"]"
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
sls invoke local --function analyze -p request.json
```

Which should result in response similar to the following:

```json
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v3.0! Your function executed successfully!\",\n  \"input\": \"\"\n}"
}
```
