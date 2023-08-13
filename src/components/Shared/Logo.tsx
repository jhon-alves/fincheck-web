interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M18.437 7.58594H9.38568C7.19662 7.58594 5.82373 9.13611 5.82373 11.3306V17.2513C5.82373 19.4458 7.18905 20.9959 9.38568 20.9959H18.4359C20.6336 20.9959 22 19.4458 22 17.2513V11.3306C22 9.13611 20.6336 7.58594 18.437 7.58594Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.37158 12.0488H18.4467" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.0852 7.58365L16.4994 4.94056C15.3632 3.06933 13.3979 2.43801 11.5116 3.57524L3.76284 8.23874C1.88403 9.36733 1.50568 11.4029 2.63426 13.2893L5.69569 18.3549C5.83839 18.6003 5.99622 18.8208 6.17675 19.0186V19.0262" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
