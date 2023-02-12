import React from 'react';

export type S3ConfigurationContextValue = {
  awsRegion: string;
  awsAccessKeyId: string;
  bucketName: string;
};

export const S3ConfigurationContext = React.createContext<S3ConfigurationContextValue>({
  awsAccessKeyId: '',
  awsRegion: 'us-east-1',
  bucketName: '',
});
