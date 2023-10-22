import { useRouter } from 'next/router';

function LogOut() {
    const router = useRouter();
  
    const redirectToHomePage = () => {
      localStorage.removeItem('Token');
      router.push('/');
    }
  
    return (
      <div>
        {/* További komponens tartalom... */}
        <button
        className="bg-slate-500 hover:bg-slate-700 text-white p-2 rounded-md m-2"
        onClick={redirectToHomePage}>
          LogOut
        </button>
      </div>
    );
  }
  
  export default LogOut