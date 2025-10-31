//
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { knife4jSetup } from 'nest-knife4j'
import { NestFactory } from '@nestjs/core'

export async function Api_doc_group_swagger_knife4j2(app: any, list_module: any[]) {
  const list_docs = []
  for (const item of list_module) {
    // console.log(`111---item:`, item)
    const doc_config = new DocumentBuilder().setTitle(item.title).setDescription(item.description).setVersion('0.1').build()
    const document = SwaggerModule.createDocument(app, doc_config, { include: item.imports })
    SwaggerModule.setup(item.title, app, document)
    list_docs.push({
      name: item.title,
      url: `/${item.title}-json`,
      swaggerVersion: '0',
      location: ``,
    })
    // console.log(`111---list_docs:`, list_docs)
    knife4jSetup(app, list_docs)
  }
}
