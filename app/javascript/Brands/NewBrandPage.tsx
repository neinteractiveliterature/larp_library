import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform/lib';
import sortBy from 'lodash/sortBy';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { generateBrandPath } from '../URLGenerators';
import BrandFormFields, { BrandFormFieldsProps } from './BrandFormFields';
import { useCreateBrandMutation } from './mutations.generated';
import { useNewBrandQuery } from './queries.generated';

export default LoadQueryWrapper(useNewBrandQuery, function NewBrandPage({ data }) {
  const navigate = useNavigate();
  const [brand, setBrand] = useState<BrandFormFieldsProps['brand']>({ name: '', description: '' });
  const [createBrand, { loading, error }] = useCreateBrandMutation();

  const submitBrand = async () => {
    const result = await createBrand({
      variables: {
        brandAttributes: {
          name: brand.name,
          description: brand.description,
        },
      },
    });

    const newBrand = result.data?.createBrand?.brand;
    if (newBrand) {
      navigate(generateBrandPath(newBrand));
    }
  };

  const { currentUser } = data;

  useEffect(() => {
    if (!currentUser) {
      navigate('/users/sign_in');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return <></>;
  }

  return (
    <>
      <h1>Publish your larps</h1>
      {currentUser.brands.length > 0 && (
        <div className="alert alert-warning">
          <p>
            <strong>Hey {currentUser.name}!</strong>
          </p>
          <p>
            You’re already signed up as a larp creator. If you want to publish a larp under an
            existing brand, go to the brand page and click “new project.” Here are your current
            brands:
          </p>
          <ul className="list-inline">
            {sortBy(currentUser.brands, (brand) => brand.name).map((brand) => (
              <li className="list-inline-item" key={brand.id}>
                <Link to={generateBrandPath(brand)}>{brand.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p>
        Hi! We’re really glad you’re interested in publishing your larps on Larp Library! In order
        to get started, you first need to fill out a short form to become a larp creator on this
        site. An administrator will review your submission and will get back to you as soon as
        possible.
      </p>
      <BrandFormFields brand={brand} onChange={setBrand} />

      <button type="button" className="btn btn-primary" onClick={submitBrand} disabled={loading}>
        Submit
      </button>

      <ErrorDisplay graphQLError={error} />
    </>
  );
});
