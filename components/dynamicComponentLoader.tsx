// DynamicComponentLoader.tsx
import dynamic from 'next/dynamic';

const DynamicYourComponent = dynamic(() => import('../components/playground'), {
  ssr: false, // kikapcsolja a szerveroldali futtatást
});

export default DynamicYourComponent;
