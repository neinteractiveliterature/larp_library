import React from 'react';

export type S3ConfigurationContextValue = {
  awsAccessKeyId: string;
  bucketName: string;
};

export const S3ConfigurationContext = React.createContext<S3ConfigurationContextValue>({
  awsAccessKeyId: '',
  bucketName: '',
});
