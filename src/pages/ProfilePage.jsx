import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { User, Lock, Save, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, login } = useAuth(); // We might need a way to update the user in context, but since login doesn't expose it easily, we might just update local storage or fetch profile.
  const { toast } = useToast();

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullname: user.fullname,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const updatedUser = await authService.updateProfile(profileData);
      toast.success('Profile Updated', 'Your profile details have been saved.');
      // Update local storage with new user details
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUser = { ...storedUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      // Optionally reload the page to reflect changes in Header
      window.location.reload();
    } catch (err) {
      toast.error('Update Failed', err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.warning('Validation Error', 'New passwords do not match.');
    }
    if (passwordData.newPassword.length < 6) {
      return toast.warning('Validation Error', 'Password must be at least 6 characters.');
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password Updated', 'Your password has been changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error('Update Failed', err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={24} color="#4f46e5" />
          My Profile
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Update your personal details and manage your account security.</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }}>
        
        {/* Profile Settings Card */}
        <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>Personal Information</h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>Update your name and email address.</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={profileData.fullname}
                  onChange={handleProfileChange}
                  required
                  className="input-field"
                  style={{ background: '#f8fafc' }}
                />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  className="input-field"
                  style={{ background: '#f8fafc' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <Shield size={16} color="#059669" />
                <span>Role: <strong style={{ color: '#0f172a' }}>{user?.role}</strong></span>
              </div>
              
              <button type="submit" disabled={profileLoading} className="btn-primary" style={{ width: 'auto', padding: '0.625rem 1.5rem' }}>
                {profileLoading ? <div className="spinner" /> : <Save size={16} />}
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Settings Card */}
        <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>Security</h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>Change your account password.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '400px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="input-field"
                style={{ background: '#f8fafc' }}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="input-field"
                style={{ background: '#f8fafc' }}
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="input-field"
                style={{ background: '#f8fafc' }}
                placeholder="Re-enter new password"
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" disabled={passwordLoading} className="btn-primary" style={{ width: 'auto', padding: '0.625rem 1.5rem', background: '#0f172a' }}>
                {passwordLoading ? <div className="spinner" /> : <Save size={16} />}
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
