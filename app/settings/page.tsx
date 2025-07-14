"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  CreditCard,
  Tag,
  Bell,
  MessageSquare,
  Plus,
  X,
  Edit2,
  Check,
  AlertCircle
} from "lucide-react";
import { 
  defaultSettings, 
  walletAccounts,
  defaultIncomeCategories,
  defaultExpenseCategories 
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { TransactionCategory } from "@/lib/types";

/**
 * Theme selector component
 */
function ThemeSelector({
  theme,
  onChange
}: {
  theme: 'light' | 'dark' | 'system';
  onChange: (theme: 'light' | 'dark' | 'system') => void;
}) {
  const options = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value as typeof theme)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
            theme === option.value
              ? "border-primary bg-primary/10"
              : "border-border hover:bg-muted"
          )}
        >
          <option.icon className="h-5 w-5" />
          <span className="text-sm font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Category item component
 */
function CategoryItem({
  category,
  onEdit,
  onDelete
}: {
  category: TransactionCategory;
  onEdit: (category: TransactionCategory) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);

  const handleSave = () => {
    onEdit({ ...category, name: editedName });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="bg-background border border-border rounded px-2 py-1 text-sm"
            autoFocus
          />
        ) : (
          <span className="text-sm font-medium">{category.name}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <Check className="h-4 w-4 text-green-600" />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(category.id)}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [incomeCategories, setIncomeCategories] = useState(defaultIncomeCategories);
  const [expenseCategories, setExpenseCategories] = useState(defaultExpenseCategories);
  const [showAddCategory, setShowAddCategory] = useState<'income' | 'expense' | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings({ ...settings, theme });
    // In a real app, this would update the actual theme
  };

  const handlePaymentAccountChange = (accountId: string) => {
    setSettings({ ...settings, defaultPaymentAccount: accountId });
  };

  const handleAddCategory = (type: 'income' | 'expense') => {
    if (!newCategoryName.trim()) return;

    const newCategory: TransactionCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      type,
      color: type === 'income' ? '#10b981' : '#ef4444'
    };

    if (type === 'income') {
      setIncomeCategories([...incomeCategories, newCategory]);
    } else {
      setExpenseCategories([...expenseCategories, newCategory]);
    }

    setNewCategoryName('');
    setShowAddCategory(null);
  };

  const handleEditCategory = (category: TransactionCategory) => {
    if (category.type === 'income') {
      setIncomeCategories(incomeCategories.map(c => 
        c.id === category.id ? category : c
      ));
    } else {
      setExpenseCategories(expenseCategories.map(c => 
        c.id === category.id ? category : c
      ));
    }
  };

  const handleDeleteCategory = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncomeCategories(incomeCategories.filter(c => c.id !== id));
    } else {
      setExpenseCategories(expenseCategories.filter(c => c.id !== id));
    }
  };

  const handleDiscordToggle = () => {
    setSettings({
      ...settings,
      discord: {
        ...settings.discord,
        enabled: !settings.discord.enabled
      }
    });
  };

  const handleNotificationToggle = (key: keyof typeof settings.discord.notifications) => {
    setSettings({
      ...settings,
      discord: {
        ...settings.discord,
        notifications: {
          ...settings.discord.notifications,
          [key]: !settings.discord.notifications[key]
        }
      }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize your BIT Track experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Appearance */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
            </div>
          </div>
          <ThemeSelector theme={settings.theme} onChange={handleThemeChange} />
        </div>

        {/* Payment Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Payment Settings</h2>
              <p className="text-sm text-muted-foreground">
                Default account for receiving payments
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {walletAccounts.map(account => (
              <label
                key={account.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="defaultAccount"
                  value={account.id}
                  checked={settings.defaultPaymentAccount === account.id}
                  onChange={() => handlePaymentAccountChange(account.id)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {account.type.replace('-', ' ')}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Transaction Categories */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Transaction Categories</h2>
              <p className="text-sm text-muted-foreground">
                Manage income and expense categories
              </p>
            </div>
          </div>

          {/* Income Categories */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Income Categories</h3>
              <button
                onClick={() => setShowAddCategory('income')}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {incomeCategories.map(category => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={(id) => handleDeleteCategory(id, 'income')}
                />
              ))}
              {showAddCategory === 'income' && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="flex-1 bg-background border border-border rounded px-3 py-1 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddCategory('income')}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategory(null);
                      setNewCategoryName('');
                    }}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Expense Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Expense Categories</h3>
              <button
                onClick={() => setShowAddCategory('expense')}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {expenseCategories.map(category => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={(id) => handleDeleteCategory(id, 'expense')}
                />
              ))}
              {showAddCategory === 'expense' && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="flex-1 bg-background border border-border rounded px-3 py-1 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddCategory('expense')}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategory(null);
                      setNewCategoryName('');
                    }}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Discord Integration */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Discord Integration</h2>
              <p className="text-sm text-muted-foreground">
                Send notifications to Discord webhook
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.discord.enabled}
                onChange={handleDiscordToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {settings.discord.enabled && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Webhook URL
                </label>
                <input
                  type="text"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={settings.discord.webhookUrl || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    discord: {
                      ...settings.discord,
                      webhookUrl: e.target.value
                    }
                  })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium mb-2">Notifications</p>
                {Object.entries(settings.discord.notifications).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <span className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleNotificationToggle(key as keyof typeof settings.discord.notifications)}
                      className="w-4 h-4 text-primary rounded"
                    />
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Changes are saved automatically</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
              isSaving
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}