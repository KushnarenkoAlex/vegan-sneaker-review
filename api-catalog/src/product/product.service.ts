import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

@Injectable()
export class ProductService {
  async create(createProductDto: CreateProductDto) {
    const product = {
      id: uuid(),
      ...createProductDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await dynamoDB
        .put({
          TableName: process.env.PRODUCTS_TABLE_NAME,
          Item: product,
        })
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return product;
  }

  findAll() {
    return `This action returns all product`;
  }

  async findOne(id: number) {
    let product;
    try {
      const result = await dynamoDB
        .get({
          TableName: process.env.PRODUCTS_TABLE_NAME,
          Key: { id },
        })
        .promise();
      product = result.Item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
