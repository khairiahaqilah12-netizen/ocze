import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BottomNav } from './components/layout/BottomNav';
import { LogoutDialog } from './components/common/LogoutDialog';
import { Toast } from './components/common/Toast';

import { SplashScreen } from './screens/auth/SplashScreen';
import { WelcomeScreen } from './screens/auth/WelcomeScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { SignUpScreen } from './screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from './screens/auth/ForgotPasswordScreen';

import { HomeScreen } from './screens/shop/HomeScreen';
import { ShopScreen } from './screens/shop/ShopScreen';
import { ProductDetailScreen } from './screens/shop/ProductDetailScreen';

import { CartScreen } from './screens/checkout/CartScreen';
import { CheckoutScreen } from './screens/checkout/CheckoutScreen';
import { PaymentScreen } from './screens/checkout/PaymentScreen';
import { OrderConfirmationScreen } from './screens/checkout/OrderConfirmationScreen';

import { OrdersScreen } from './screens/account/OrdersScreen';
import { OrderDetailScreen } from './screens/account/OrderDetailScreen';
import { RewardsScreen } from './screens/account/RewardsScreen';
import { ProfileScreen } from './screens/account/ProfileScreen';
import {
  AddressesScreen,
  EditProfileScreen,
  NotificationsScreen,
  SettingsScreen,
  WishlistScreen,
} from './screens/account/ProfileSubScreens';
import { HelpCenterScreen } from './screens/account/HelpCenterScreen';
import { SkinGuideScreen } from './screens/care/SkinGuideScreen';
import { SkinJournalScreen } from './screens/care/SkinJournalScreen';

const AUTH_SCREENS = new Set([
  'splash',
  'welcome',
  'login',
  'signup',
  'forgot-password',
]);

const AppRouter: React.FC = () => {
  const { screen } = useApp();
  const isAuthScreen = AUTH_SCREENS.has(screen);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'login':
        return <LoginScreen />;
      case 'signup':
        return <SignUpScreen />;
      case 'forgot-password':
        return <ForgotPasswordScreen />;
      case 'home':
        return <HomeScreen />;
      case 'shop':
        return <ShopScreen />;
      case 'product-detail':
        return <ProductDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'payment':
        return <PaymentScreen />;
      case 'order-confirmation':
        return <OrderConfirmationScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'order-detail':
        return <OrderDetailScreen />;
      case 'rewards':
        return <RewardsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'edit-profile':
        return <EditProfileScreen />;
      case 'addresses':
        return <AddressesScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      case 'help':
        return <HelpCenterScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'skin-guide':
        return <SkinGuideScreen />;
      case 'skin-journal':
        return <SkinJournalScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EFEAF6]">
      <div className="min-h-screen w-full max-w-[430px] mx-auto bg-[#FAF8FD] sm:shadow-2xl sm:shadow-[#6D5D9B]/15 sm:border-x sm:border-[#E2D8F0] relative overflow-x-hidden flex flex-col">
        <div className="flex-1">
          {renderScreen()}
        </div>
        {!isAuthScreen && <BottomNav />}
        <LogoutDialog />
        <Toast />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
