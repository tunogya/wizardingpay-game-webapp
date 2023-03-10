// addresses of a user
import {DynamoDBDocumentClient, QueryCommand} from '@aws-sdk/lib-dynamodb';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {NextApiRequest, NextApiResponse} from 'next';

const ddbClient = new DynamoDBClient({
  region: 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  }
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {id} = req.query;
  try {
    // query addresses where PK = TG-USER#id, and SK begins with ETH#
    const addressRes = await ddbDocClient.send(new QueryCommand({
      TableName: 'wizardingpay',
      KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `TG-USER#${id}`,
        ':sk': 'ETH#',
      }
    }));
    const addresses = addressRes.Items?.map((item) => {
      return item.SK?.replace('ETH#', '');
    });
    res.status(200).json(addresses);
  } catch (e) {
    res.status(500).json({message: e});
  }
}