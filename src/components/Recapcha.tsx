import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { BASE_URL } from '../constants/endpoints';

function Recaptcha() {
  const siteKey = process.env
    .NEXT_PUBLIC_RECAPTCHA_SITE_KEY as unknown as string;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const onChange = async (e: any) => {
    if (!e) {
      console.log('***************expired------------');
      router.push('/recaptcha');
    }
    const data = {
      token: e,
    };
    const res = await fetch(BASE_URL + '/user/recaptcha', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const { success } = (await res.json()) as any;

    if (success) router.push('/preferences');
  };

  return (
    // <PrivateRoute>
    <div
      style={{
        margin: '0 auto',
        marginTop: '100px',
        overflow: 'hidden',
      }}
    >
      <ReCAPTCHA sitekey={siteKey} onChange={onChange} />
    </div>
    // </PrivateRoute>
  );
}

export default Recaptcha;
