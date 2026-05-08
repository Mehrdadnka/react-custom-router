import { CheckCircle, Home } from 'lucide-react'
import { useRouterStore } from './store/router.store'
import { Link } from './router/core/Link';
import { AppLayout } from './components/AppLayout';
import { NotFoundPage } from './pages/NotFoundPage';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';

function CurrentPath() {
  const pathname = useRouterStore((s) => s.pathname);
  
  return <p>
    Current Path: <code>{pathname}</code>
  </p>
}

export default function App() {
  const pathname = useRouterStore((s) => s.pathname)

  return (
    <AppLayout>
    <div>
      <nav>
        <Link to='/'>
          <Home size={12} />
          Home
        </Link> 
        | 
        <Link to='/about'>
          <CheckCircle size={12} />
          About
        </Link>
       </nav>

       <div>
        {pathname === '/' && <HomePage />}
        {pathname === '/about' && <AboutPage />}
        {pathname !== '/' && pathname !== '/about' && <NotFoundPage />}

       </div>
       <CurrentPath />
    </div>
    </AppLayout>
  )
}