import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalContext';
import { Alum, Domain } from '../../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Briefcase, MapPin, ExternalLink, Link as LinkIcon, Star, Map, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinary';
import { Toast, useToast } from '../Projects'; // Using existing Toast
import { motion, AnimatePresence } from 'framer-motion';

const DOMAINS: Domain[] = ['Software Dev', 'Machine Learning', 'Backend / DevOps', 'Cybersecurity', 'UI/UX Design', 'Data Engineering', 'Frontend / Web'];

const ManageAlumni: React.FC = () => {
  const { alumni, addAlum, updateAlum, deleteAlum } = useGlobalState();
  const { toast, showToast, hideToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Alum | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Alum | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const resetForm = () => {
    setIsEditing(false);
    setFormData(null);
  };

  const handleCreateNew = () => {
    setFormData({
      id: Math.random().toString(36).substring(7),
      name: '',
      initials: '',
      photo: '',
      role: '',
      company: '',
      batch: new Date().getFullYear().toString(),
      location: '',
      domain: 'Software Dev',
      bio: '',
      advice: '',
      tech: [],
      linkedin: '',
      github: '',
      website: '',
      achievements: [],
      roadmap: []
    });
    setIsEditing(true);
  };

  const handleEdit = (alum: Alum) => {
    setFormData(JSON.parse(JSON.stringify(alum))); // Deep copy
    setIsEditing(true);
  };

  const handleDeleteClick = (alum: Alum) => {
    setDeleteTarget(alum);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteAlum(deleteTarget.id);
      showToast('Alumni removed successfully', 'success');
      setDeleteTarget(null);
    }
  };

  const handleSave = () => {
    if (!formData?.name || !formData?.company || !formData?.role) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    // Auto generate initials if not set
    if (!formData.initials && formData.name) {
      formData.initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    if (alumni.find(a => a.id === formData.id)) {
      updateAlum(formData);
      showToast('Alumni updated successfully', 'success');
    } else {
      addAlum(formData);
      showToast('New Alumni added', 'success');
    }
    resetForm();
  };

  // --- Array Handlers ---
  const handleAddTech = () => {
    if (!formData) return;
    setFormData({ ...formData, tech: [...formData.tech, ''] });
  };
  const handleUpdateTech = (index: number, value: string) => {
    if (!formData) return;
    const newTech = [...formData.tech];
    newTech[index] = value;
    setFormData({ ...formData, tech: newTech });
  };
  const handleRemoveTech = (index: number) => {
    if (!formData) return;
    setFormData({ ...formData, tech: formData.tech.filter((_, i) => i !== index) });
  };

  const handleAddAchievement = () => {
    if (!formData) return;
    setFormData({ ...formData, achievements: [...formData.achievements, ''] });
  };
  const handleUpdateAchievement = (index: number, value: string) => {
    if (!formData) return;
    const newAch = [...formData.achievements];
    newAch[index] = value;
    setFormData({ ...formData, achievements: newAch });
  };
  const handleRemoveAchievement = (index: number) => {
    if (!formData) return;
    setFormData({ ...formData, achievements: formData.achievements.filter((_, i) => i !== index) });
  };

  // --- Roadmap Handlers ---
  const handleAddRoadmapPhase = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      roadmap: [...formData.roadmap, { phase: `0${formData.roadmap.length + 1}`, title: '', items: [''] }]
    });
  };
  const handleUpdateRoadmapPhase = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newRoadmap = [...formData.roadmap];
    newRoadmap[index] = { ...newRoadmap[index], [field]: value };
    setFormData({ ...formData, roadmap: newRoadmap });
  };
  const handleRemoveRoadmapPhase = (index: number) => {
    if (!formData) return;
    setFormData({ ...formData, roadmap: formData.roadmap.filter((_, i) => i !== index) });
  };

  const handleAddRoadmapItem = (phaseIndex: number) => {
    if (!formData) return;
    const newRoadmap = [...formData.roadmap];
    newRoadmap[phaseIndex].items.push('');
    setFormData({ ...formData, roadmap: newRoadmap });
  };
  const handleUpdateRoadmapItem = (phaseIndex: number, itemIndex: number, value: string) => {
    if (!formData) return;
    const newRoadmap = [...formData.roadmap];
    newRoadmap[phaseIndex].items[itemIndex] = value;
    setFormData({ ...formData, roadmap: newRoadmap });
  };
  const handleRemoveRoadmapItem = (phaseIndex: number, itemIndex: number) => {
    if (!formData) return;
    const newRoadmap = [...formData.roadmap];
    newRoadmap[phaseIndex].items = newRoadmap[phaseIndex].items.filter((_, i) => i !== itemIndex);
    setFormData({ ...formData, roadmap: newRoadmap });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData) {
      setUploadingPhoto(true);
      try {
        const url = await uploadToCloudinary(file);
        setFormData({ ...formData, photo: url });
      } catch (err: any) {
        alert(err.message || 'Upload failed');
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-surface border border-surfaceLight p-6 rounded-3xl">
        <div>
          <h2 className="text-2xl font-black text-white">Manage Alumni</h2>
          <p className="text-sm text-textMuted mt-1">Curate and update the Code Vimarsh Alumni network</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors"
          >
            <Plus size={18} />
            <span>Add Alumni</span>
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alumni.map(alum => (
            <div key={alum.id} className="bg-surface border border-surfaceLight rounded-3xl p-5 hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-bgDark border border-surfaceLight flex-shrink-0">
                  {alum.photo ? (
                    <img src={alum.photo} alt={alum.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg bg-primary/10">
                      {alum.initials}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">{alum.name}</h3>
                  <p className="text-xs text-primary">{alum.role} @ {alum.company}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-xs text-textMuted">
                  <Briefcase size={12} /> {alum.domain}
                </div>
                <div className="flex items-center gap-2 text-xs text-textMuted">
                  <MapPin size={12} /> {alum.location} (Batch {alum.batch})
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-surfaceLight/50">
                <button
                  onClick={() => handleEdit(alum)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary hover:text-black transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(alum)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-surfaceLight rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-surfaceLight flex items-center justify-between sticky top-0 bg-surface/90 backdrop-blur-md z-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit2 size={18} className="text-primary" />
              {formData?.name ? `Edit: ${formData.name}` : 'Create New Alumni'}
            </h3>
            <div className="flex items-center gap-3">
              <button onClick={resetForm} className="px-4 py-2 text-sm font-bold text-textMuted hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,106,0,0.3)]">
                <Save size={16} /> Save Alumni
              </button>
            </div>
          </div>

          {formData && (
            <div className="p-6 space-y-8 h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-textMuted uppercase mb-1.5 block">Full Name *</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="e.g. Rohan Mehta" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-textMuted uppercase mb-1.5 block">Role *</label>
                      <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="e.g. SDE II" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-textMuted uppercase mb-1.5 block">Company *</label>
                      <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="e.g. Google" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-textMuted uppercase mb-1.5 block">Batch *</label>
                      <input type="text" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="e.g. 2021" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-textMuted uppercase mb-1.5 block">Location *</label>
                      <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="e.g. Bengaluru, India" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-textMuted uppercase mb-1.5 block">Domain Area *</label>
                    <select value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value as Domain})} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary">
                      {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-textMuted uppercase mb-1.5 block flex items-center gap-2"><ImageIcon size={14}/> Profile Photo</label>
                    <div className="flex items-center gap-4">
                      {formData.photo && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-surfaceLight bg-bgDark flex-shrink-0">
                          <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className={`flex-1 cursor-pointer bg-bgDark border border-dashed border-surfaceLight rounded-xl px-4 py-2.5 hover:border-primary/50 transition-colors flex items-center justify-center gap-2 ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {uploadingPhoto ? (
                          <Loader2 size={16} className="text-primary animate-spin" />
                        ) : (
                          <ImageIcon size={16} className="text-textMuted" />
                        )}
                        <span className="text-sm text-textMuted">
                          {uploadingPhoto ? 'Uploading photo...' : 'Click to upload photo'}
                        </span>
                        <input type="file" accept="image/*" disabled={uploadingPhoto} className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-textMuted uppercase mb-1.5 block">Short Bio</label>
                    <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary custom-scrollbar" placeholder="Brief intro about their work..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-textMuted uppercase mb-1.5 block">Best Advice</label>
                    <textarea value={formData.advice} onChange={e => setFormData({...formData, advice: e.target.value})} rows={2} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-primary custom-scrollbar font-mono" placeholder="Their golden tip for students..." />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-5 border border-surfaceLight rounded-2xl bg-bgDark/50">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><LinkIcon size={16} className="text-primary"/> External Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" value={formData.linkedin || ''} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="LinkedIn URL" />
                  <input type="text" value={formData.github || ''} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="GitHub URL" />
                  <input type="text" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-bgDark border border-surfaceLight rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="Portfolio/Website URL" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tech Stack */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white">Tech Stack</h4>
                    <button onClick={handleAddTech} className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1"><Plus size={12}/> Add</button>
                  </div>
                  <div className="space-y-2">
                    {formData.tech.map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={t} onChange={e => handleUpdateTech(i, e.target.value)} className="flex-1 bg-bgDark border border-surfaceLight rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="e.g. React" />
                        <button onClick={() => handleRemoveTech(i)} className="p-1.5 text-textMuted hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    ))}
                    {formData.tech.length === 0 && <p className="text-xs text-textMuted italic">No tech stack added.</p>}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2"><Star size={14} className="text-yellow-500"/> Achievements</h4>
                    <button onClick={handleAddAchievement} className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1"><Plus size={12}/> Add</button>
                  </div>
                  <div className="space-y-2">
                    {formData.achievements.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={a} onChange={e => handleUpdateAchievement(i, e.target.value)} className="flex-1 bg-bgDark border border-surfaceLight rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="e.g. AWS Certified" />
                        <button onClick={() => handleRemoveAchievement(i)} className="p-1.5 text-textMuted hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    ))}
                    {formData.achievements.length === 0 && <p className="text-xs text-textMuted italic">No achievements added.</p>}
                  </div>
                </div>
              </div>

              {/* Roadmap Builder */}
              <div className="border border-surfaceLight rounded-2xl p-5 bg-bgDark/30">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2"><Map size={18} className="text-primary"/> Step-by-Step Roadmap</h4>
                    <p className="text-xs text-textMuted mt-1">Define the learning path for this domain.</p>
                  </div>
                  <button onClick={handleAddRoadmapPhase} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-black transition-colors text-xs">
                    <Plus size={14} /> Add Phase
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.roadmap.map((phase, pIndex) => (
                    <div key={pIndex} className="bg-surface border border-surfaceLight p-4 rounded-xl relative group">
                      <button onClick={() => handleRemoveRoadmapPhase(pIndex)} className="absolute top-4 right-4 text-textMuted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="grid grid-cols-[80px_1fr] gap-4 mb-4 pr-8">
                        <div>
                          <label className="text-[10px] font-bold text-textMuted uppercase mb-1 block">Phase #</label>
                          <input type="text" value={phase.phase} onChange={e => handleUpdateRoadmapPhase(pIndex, 'phase', e.target.value)} className="w-full bg-bgDark border border-surfaceLight rounded-lg px-3 py-2 text-sm text-center font-bold text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-textMuted uppercase mb-1 block">Phase Title</label>
                          <input type="text" value={phase.title} onChange={e => handleUpdateRoadmapPhase(pIndex, 'title', e.target.value)} className="w-full bg-bgDark border border-surfaceLight rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" placeholder="e.g. CS Fundamentals" />
                        </div>
                      </div>

                      <div className="bg-bgDark/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-bold text-textMuted uppercase">Bullet Points</label>
                          <button onClick={() => handleAddRoadmapItem(pIndex)} className="text-[10px] font-bold text-primary hover:text-white transition-colors">+ Add Point</button>
                        </div>
                        <div className="space-y-2">
                          {phase.items.map((item, iIndex) => (
                            <div key={iIndex} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                              <input type="text" value={item} onChange={e => handleUpdateRoadmapItem(pIndex, iIndex, e.target.value)} className="flex-1 bg-transparent border-b border-surfaceLight px-2 py-1 text-xs text-white focus:outline-none focus:border-primary" placeholder="e.g. Operating Systems" />
                              <button onClick={() => handleRemoveRoadmapItem(pIndex, iIndex)} className="text-textMuted hover:text-red-500 transition-colors"><X size={12}/></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.roadmap.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-surfaceLight rounded-xl">
                      <Map size={24} className="text-textMuted mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-textMuted">No roadmap phases defined.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl p-6 bg-surface border border-surfaceLight shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning/Alert Icon Header */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Trash2 size={24} />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Remove Alumni Record</h3>
                  <p className="text-sm text-textMuted leading-relaxed">
                    Are you sure you want to permanently delete the alumni record for <strong className="text-white font-semibold">{deleteTarget.name}</strong>? This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3 bg-bgDark border border-surfaceLight text-textMuted font-bold rounded-xl text-xs uppercase tracking-wider hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />
    </div>
  );
};

export default ManageAlumni;
