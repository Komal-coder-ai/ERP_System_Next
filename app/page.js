export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to ERP System</h1>
        <p style={styles.subtitle}>
          A Complete Full-Stack Enterprise Resource Planning Solution
        </p>

        <div style={styles.buttonContainer}>
          <a href="/register" style={styles.button}>
            Create Account
          </a>
          <a href="/login" style={{ ...styles.button, backgroundColor: '#28a745' }}>
            Login
          </a>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <h3>User Registration</h3>
            <p>Create a new account with secure password hashing</p>
          </div>
          <div style={styles.feature}>
            <h3>Secure Login</h3>
            <p>Login with JWT authentication and session management</p>
          </div>
          <div style={styles.feature}>
            <h3>Admin Panel</h3>
            <p>Manage users and system settings as an administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '40px',
    lineHeight: '1.6',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginBottom: '60px',
  },
  button: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    display: 'inline-block',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '40px',
  },
  feature: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
};
