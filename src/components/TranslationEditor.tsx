import { useState, useMemo, useCallback } from 'react';
import { useStore } from '../stores/useStore';
import { registerTranslations } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Save,
  Download,
  Upload,
  ChevronDown,
  ChevronRight,
  Languages,
  Copy,
  Check,
  RotateCcw,
  FileJson,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { defaultTranslations } from '../i18n/locales/defaultTranslations';

interface Props {
  languageCode: string;
  languageName: string;
  onClose: () => void;
}

type TranslationMap = Record<string, Record<string, string>>;

export default function TranslationEditor({ languageCode, languageName, onClose }: Props) {
  const { languages, updateLanguageTranslations } = useStore();

  // Current saved translations for this language
  const savedTranslations = useMemo(() => {
    const lang = languages.find((l) => l.code === languageCode);
    return lang?.translations || {};
  }, [languages, languageCode]);

  // Build a nested map from flat saved translations for display
  const savedNested = useMemo((): TranslationMap => {
    const nested: TranslationMap = {};
    for (const [section, keys] of Object.entries(defaultTranslations)) {
      nested[section] = {};
      for (const key of Object.keys(keys)) {
        const flatKey = `${section}.${key}`;
        // Check if savedTranslations has the flat key
        if (savedTranslations[flatKey] !== undefined) {
          nested[section][key] = savedTranslations[flatKey];
        } else {
          nested[section][key] = ''; // empty = not yet translated
        }
      }
    }
    return nested;
  }, [savedTranslations]);

  // Local editable state (nested form)
  const [formData, setFormData] = useState<TranslationMap>(savedNested);
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const expanded: Record<string, boolean> = {};
    Object.keys(defaultTranslations).forEach((s) => (expanded[s] = true));
    return expanded;
  });
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Flat key count
  const totalKeys = useMemo(() => {
    let count = 0;
    for (const keys of Object.values(defaultTranslations)) {
      count += Object.keys(keys).length;
    }
    return count;
  }, []);

  const translatedCount = useMemo(() => {
    let count = 0;
    for (const section of Object.values(formData)) {
      for (const val of Object.values(section)) {
        if (val.trim() !== '') count++;
      }
    }
    return count;
  }, [formData]);

  // Filtered sections
  const filteredSections = useMemo(() => {
    if (!search.trim()) return formData;
    const q = search.toLowerCase();
    const result: TranslationMap = {};
    for (const [section, keys] of Object.entries(formData)) {
      const matchingKeys: Record<string, string> = {};
      for (const [key, val] of Object.entries(keys)) {
        const flatKey = `${section}.${key}`.toLowerCase();
        const fallback = defaultTranslations[section]?.[key]?.toLowerCase() || '';
        if (flatKey.includes(q) || fallback.includes(q) || val.toLowerCase().includes(q)) {
          matchingKeys[key] = val;
        }
      }
      if (Object.keys(matchingKeys).length > 0) {
        result[section] = matchingKeys;
      }
    }
    return result;
  }, [formData, search]);

  const handleFieldChange = useCallback(
    (section: string, key: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
      setHasChanges(true);
    },
    []
  );

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Fill all keys with English fallback (useful starting point)
  const fillWithEnglish = useCallback(() => {
    const filled: TranslationMap = {};
    for (const [section, keys] of Object.entries(defaultTranslations)) {
      filled[section] = { ...keys };
    }
    setFormData(filled);
    setHasChanges(true);
    toast.success('Filled all keys with English text');
  }, []);

  // Reset to saved state
  const resetToSaved = useCallback(() => {
    setFormData(savedNested);
    setHasChanges(false);
    toast.success('Reset to last saved state');
  }, [savedNested]);

  // Save translations
  const handleSave = useCallback(() => {
    // Flatten nested formData into flat Record<string, string>
    const flat: Record<string, string> = {};
    for (const [section, keys] of Object.entries(formData)) {
      for (const [key, val] of Object.entries(keys)) {
        flat[`${section}.${key}`] = val;
      }
    }
    updateLanguageTranslations(languageCode, flat);
    registerTranslations(languageCode, flat);
    setHasChanges(false);
    toast.success(`Translations saved for ${languageName}`);
  }, [formData, languageCode, languageName, updateLanguageTranslations]);

  // Export as JSON
  const handleExport = useCallback(() => {
    const exportData: Record<string, string> = {};
    for (const [section, keys] of Object.entries(formData)) {
      for (const [key, val] of Object.entries(keys)) {
        const flatKey = `${section}.${key}`;
        exportData[flatKey] = val || defaultTranslations[section]?.[key] || '';
      }
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translations-${languageCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Translations exported');
  }, [formData, languageCode]);

  // Import from JSON
  const handleOpenImport = useCallback(() => {
    setJsonText(JSON.stringify(
      Object.fromEntries(
        Object.entries(defaultTranslations).flatMap(([section, keys]) =>
          Object.keys(keys).map((key) => [`${section}.${key}`, savedTranslations[`${section}.${key}`] || ''])
        )
      ),
      null,
      2
    ));
    setShowJsonEditor(true);
  }, [savedTranslations]);

  const handleImportJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      if (typeof parsed !== 'object' || parsed === null) {
        toast.error('Invalid JSON: must be an object');
        return;
      }
      // Rebuild nested form from flat JSON
      const newFormData: TranslationMap = {};
      for (const [section, keys] of Object.entries(defaultTranslations)) {
        newFormData[section] = {};
        for (const key of Object.keys(keys)) {
          const flatKey = `${section}.${key}`;
          newFormData[section][key] = parsed[flatKey] || '';
        }
      }
      setFormData(newFormData);
      setHasChanges(true);
      setShowJsonEditor(false);
      toast.success('JSON imported successfully');
    } catch {
      toast.error('Invalid JSON format');
    }
  }, [jsonText]);

  // Copy key path to clipboard
  const copyKey = useCallback((section: string, key: string) => {
    navigator.clipboard.writeText(`${section}.${key}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  const sectionLabels: Record<string, string> = {
    app: 'App',
    auth: 'Authentication',
    nav: 'Navigation',
    dashboard: 'Dashboard',
    plans: 'Investment Plans',
    deposit: 'Deposit',
    withdraw: 'Withdrawal',
    transactions: 'Transactions',
    settings: 'Settings',
    chat: 'Chat',
    admin: 'Admin Panel',
    common: 'Common',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Languages className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-surface-900">
                Translate: {languageName}
              </h3>
              <p className="text-xs text-surface-400">
                {translatedCount}/{totalKeys} keys translated
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-3 shrink-0">
          <div className="w-full bg-surface-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalKeys > 0 ? (translatedCount / totalKeys) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-surface-400 mt-1 text-right">
            {Math.round(totalKeys > 0 ? (translatedCount / totalKeys) * 100 : 0)}% complete
          </p>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 flex flex-wrap items-center gap-2 border-b border-surface-100 shrink-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              className="input-field pl-10 py-2 text-sm"
              placeholder="Search keys or values..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={fillWithEnglish} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5" title="Fill all fields with English text">
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fill English</span>
          </button>
          <button onClick={resetToSaved} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5" title="Reset to last saved state">
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button onClick={handleExport} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5" title="Export translations as JSON file">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={handleOpenImport} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5" title="Import translations from JSON">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>
        </div>

        {/* Translation fields */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {Object.entries(filteredSections).length === 0 ? (
            <div className="text-center py-12 text-surface-400">
              <Languages className="w-10 h-10 mx-auto mb-2 text-surface-300" />
              <p className="text-sm">No keys match your search</p>
            </div>
          ) : (
            Object.entries(filteredSections).map(([section, keys]) => (
              <div key={section} className="border border-surface-100 rounded-xl overflow-hidden">
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-surface-50 hover:bg-surface-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedSections[section] ? (
                      <ChevronDown className="w-4 h-4 text-surface-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-surface-500" />
                    )}
                    <span className="font-semibold text-surface-900 text-sm">
                      {sectionLabels[section] || section}
                    </span>
                    <span className="text-xs text-surface-400 bg-surface-200 px-2 py-0.5 rounded-full">
                      {Object.keys(keys).length} keys
                    </span>
                    {/* Section progress indicator */}
                    {(() => {
                      const total = Object.keys(defaultTranslations[section] || {}).length;
                      const filled = Object.values(keys).filter((v) => v.trim() !== '').length;
                      return filled > 0 ? (
                        <span className="text-xs text-accent-600 font-medium">
                          {filled}/{total}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </button>

                {/* Key fields */}
                <AnimatePresence>
                  {expandedSections[section] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        {Object.entries(keys).map(([key, val]) => {
                          const fallback = defaultTranslations[section]?.[key] || '';
                          return (
                            <div key={key} className="group">
                              <div className="flex items-center gap-2 mb-1">
                                <button
                                  onClick={() => copyKey(section, key)}
                                  className="font-mono text-xs text-surface-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                                  title="Click to copy key"
                                >
                                  {section}.{key}
                                  {copied ? (
                                    <Check className="w-3 h-3 text-accent-500" />
                                  ) : (
                                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  )}
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {/* English fallback (read-only) */}
                                <div className="bg-surface-50 rounded-lg px-3 py-2 text-sm text-surface-500 border border-surface-100">
                                  <span className="text-[10px] text-surface-400 uppercase tracking-wide block mb-0.5">English</span>
                                  {fallback}
                                </div>
                                {/* Editable translation */}
                                <div className="relative">
                                  <input
                                    type="text"
                                    className={`input-field text-sm py-2 ${
                                      val.trim() ? 'bg-white border-surface-200' : 'bg-amber-50/50 border-amber-200'
                                    }`}
                                    placeholder={`Enter ${languageName} translation...`}
                                    value={val}
                                    onChange={(e) => handleFieldChange(section, key, e.target.value)}
                                  />
                                  {val.trim() && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-100 flex items-center justify-between shrink-0">
          <p className="text-xs text-surface-400">
            {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary text-sm">
              Close
            </button>
            <motion.button
              onClick={handleSave}
              className={`text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 ${
                hasChanges
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-surface-200 text-surface-500 cursor-default'
              }`}
              whileHover={hasChanges ? { scale: 1.02 } : {}}
              whileTap={hasChanges ? { scale: 0.98 } : {}}
            >
              <Save className="w-4 h-4" />
              Save Translations
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* JSON Import Modal */}
      <AnimatePresence>
        {showJsonEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowJsonEditor(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-surface-900">Import Translations (JSON)</h3>
                </div>
                <button onClick={() => setShowJsonEditor(false)} className="text-surface-400 hover:text-surface-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-hidden">
                <p className="text-sm text-surface-500 mb-3">
                  Paste a JSON object with flat keys like <code className="bg-surface-100 px-1 rounded text-xs">{'{ "auth.login": "Iniciar Sesión" }'}</code>.
                  Empty or missing keys will use the English fallback.
                </p>
                <textarea
                  className="w-full h-64 font-mono text-sm p-4 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-surface-50"
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <div className="px-6 py-4 border-t border-surface-100 flex gap-3">
                <button onClick={() => setShowJsonEditor(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button onClick={handleImportJson} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
