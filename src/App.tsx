/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { KeepItem, User, FilterView } from './types';
import {
  getStoredUser,
  getStoredItems,
  saveItemToStorage,
  deleteItemFromStorage,
  toggleArchiveItem,
  togglePinItem,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { SettingsView } from './components/SettingsView';
import { Footer } from './components/Footer';
import { SaveItemModal } from './components/SaveItemModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';

export default function App() {
  const [user, setUser] = useState<User>(() => getStoredUser());
  const [items, setItems] = useState<KeepItem[]>(() => getStoredItems());

  // Active view: 'overview' | 'vault' | 'settings'
  const [activeNavTab, setActiveNavTab] = useState<string>('overview');
  const [dashboardFilter, setDashboardFilter] = useState<FilterView>('all');

  // Modals state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<KeepItem | null>(null);
  const [editingItem, setEditingItem] = useState<KeepItem | null>(null);

  // Reload items helper
  const refreshItems = useCallback(() => {
    setItems(getStoredItems());
  }, []);

  // CRUD Handlers
  const handleSaveItem = (itemToSave: KeepItem) => {
    const updated = saveItemToStorage(itemToSave);
    setItems(updated);
    setEditingItem(null);
    setActiveNavTab('vault');
    setDashboardFilter('all');
  };

  const handleDeleteItem = (id: string) => {
    const updated = deleteItemFromStorage(id);
    setItems(updated);
    if (selectedItemForDetails?.id === id) {
      setSelectedItemForDetails(null);
    }
  };

  const handleToggleArchive = (id: string) => {
    const updated = toggleArchiveItem(id);
    setItems(updated);
    if (selectedItemForDetails?.id === id) {
      setSelectedItemForDetails(updated.find((i) => i.id === id) || null);
    }
  };

  const handleTogglePin = (id: string) => {
    const updated = togglePinItem(id);
    setItems(updated);
    if (selectedItemForDetails?.id === id) {
      setSelectedItemForDetails(updated.find((i) => i.id === id) || null);
    }
  };

  const handleEditItem = (item: KeepItem) => {
    setSelectedItemForDetails(null);
    setEditingItem(item);
    setIsSaveModalOpen(true);
  };

  const handleSelectNavTab = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'vault' || tab === 'all') setDashboardFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeNavTab}
        onSelectTab={handleSelectNavTab}
        onOpenSaveModal={() => {
          setEditingItem(null);
          setIsSaveModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="grow">
        {activeNavTab === 'overview' ? (
          // Explanatory Landing Page
          <LandingPage
            onStartKeeping={() => {
              setEditingItem(null);
              setIsSaveModalOpen(true);
            }}
            onOpenVault={() => handleSelectNavTab('vault')}
            sampleItems={items}
          />
        ) : activeNavTab === 'settings' ? (
          // Settings & Export View
          <SettingsView
            user={user}
            onUserUpdate={(updated) => setUser(updated)}
            onRefreshItems={refreshItems}
          />
        ) : (
          // Personal Vault Dashboard
          <Dashboard
            items={items}
            user={user}
            onOpenSaveModal={() => {
              setEditingItem(null);
              setIsSaveModalOpen(true);
            }}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onToggleArchive={handleToggleArchive}
            onTogglePin={handleTogglePin}
            onSelectItem={(item) => setSelectedItemForDetails(item)}
            currentFilter={dashboardFilter}
            onChangeFilter={(filter) => {
              setDashboardFilter(filter);
              setActiveNavTab('vault');
            }}
          />
        )}
      </main>

      {/* Minimal clean footer */}
      <Footer
        onStartKeeping={() => {
          setEditingItem(null);
          setIsSaveModalOpen(true);
        }}
        onSelectTab={(tab) => {
          setActiveNavTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Keep Something / Edit Modal */}
      <SaveItemModal
        isOpen={isSaveModalOpen}
        onClose={() => {
          setIsSaveModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialItem={editingItem}
      />

      {/* Item Details View Modal */}
      <ItemDetailsModal
        item={selectedItemForDetails}
        onClose={() => setSelectedItemForDetails(null)}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onToggleArchive={handleToggleArchive}
        onTogglePin={handleTogglePin}
      />
    </div>
  );
}
