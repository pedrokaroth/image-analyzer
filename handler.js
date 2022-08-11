"use strict";
const { get } = require("axios")

class Handler {
  constructor({
    rekognition,
    translate
  }) {
    this.rekognition = rekognition
    this.translate = translate
  }

  async main(event) {
    try {
      console.log('pegamento imagem')
      const { imageUrl } = event.queryStringParameters
      console.log(imageUrl)
      console.log('pegando buffer da imagem')
      const buffer = await this.getImageBuffer(imageUrl)

      console.log('detectando labels')
      const { names, workingItems } = await this.detectLabels(buffer)

      console.log('traduzindo nomes');
      const translatedNames = await this.translateNames(names)

      console.log('montando resposta')
      const response = []
      for (const index in workingItems.Labels) {
        response.push(`${workingItems.Labels[index].Confidence.toFixed(2)} de ser ${translatedNames[index]}`)
      }

      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        body: 'Internal Server Error'
      }
    }
  }

  async detectLabels(buffer) {
    const workingItems = await this.rekognition.detectLabels({
      Image: {
        Bytes: buffer,
      },
      MinConfidence: 80,
      MaxLabels: 5
    }).promise()

    const names = workingItems.Labels.map(({ Name }) => Name)

    return { names, workingItems }
  }

  async getImageBuffer(imageUrl) {
    const image = await get(imageUrl, {
      responseType: "arraybuffer"
    })

    return Buffer.from(image.data, "base64")
  }

  async translateNames(names) {
    const { TranslatedText } = await this.translate.translateText({
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: names.join(' | ')
    }).promise()

    return TranslatedText.split(' | ')
  }
}

const aws = require("aws-sdk")
const handler = new Handler({
  rekognition: new aws.Rekognition(),
  translate: new aws.Translate()
});

module.exports.main = handler.main.bind(handler)
