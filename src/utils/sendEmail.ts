import emailjs from '@emailjs/nodejs';

export async function emailservice(
  message: string,
  url: string,
  toEmail: string,
) {
  const templateParams = {
    name: 'SAAS Service',
    notes: ` ${message} + 'To activate Account click here' -> ${url}`,
    to: toEmail,
  };
  emailjs.init({
    publicKey: 'JeZ6_n_nIDhJsdYJh',
    privateKey: 'xF7pZBcUpDTDe-aiNzgcT',
  });

  emailjs.send('service_4jhzphm', 'template_iqb1gqe', templateParams).then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (err) => {
      console.log('FAILED...', err);
    },
  );
}
