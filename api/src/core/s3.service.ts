import { HttpRequest } from '@aws-sdk/protocol-http'
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner'
import { parseUrl } from '@aws-sdk/url-parser'
import { Sha256 } from '@aws-crypto/sha256-browser'
import { Hash } from '@aws-sdk/hash-node'
import { formatUrl } from '@aws-sdk/util-format-url'

import { Injectable } from '@nestjs/common'
import { ConfigService } from './config.service'
import { createToken } from '../common/utility'

@Injectable()
export class S3Service {
  constructor(private config: ConfigService) {}

  // public client = new S3Client({
  //   credentials: {
  //     accessKeyId: this.config.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY,
  //   },
  //   region: this.config.AWS_REGION,
  // })

  private bucket = `[todo]-public` // TODO!!!

  private presigner = new S3RequestPresigner({
    credentials: {
      accessKeyId: this.config.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY,
    },
    region: this.config.AWS_REGION,
    sha256: Hash.bind(null, 'sha256'),
  })

  async get_signed_url_for_file(object_key: string): Promise<string> {
    const s3ObjectUrl = parseUrl(
      `https://${this.bucket}.s3.${this.config.AWS_REGION}.amazonaws.com/${object_key}`,
    )

    const url = await this.presigner.presign(
      new HttpRequest({ ...s3ObjectUrl, method: 'PUT' }),
    )

    return formatUrl(url)
  }
}
