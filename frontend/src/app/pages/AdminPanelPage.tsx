import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useContent, SiteContent, HomeContent, AboutContent, ProjectsContent, ProjectItem, SkillsContent, SkillCategory, ContactContent, TimelineContent, ExperienceItem, SocialsContent } from '../context/ContentContext';
import { Plus, Trash2, Upload, Loader2, FileUp } from 'lucide-react';

const TABS = ['home', 'experience', 'projects', 'skills', 'contact', 'socials', 'json'] as const;
type TabType = typeof TABS[number];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const YEARS = Array.from({length: 40}, (_, i) => (new Date().getFullYear() - 20 + i).toString());

// --- Form Helpers ---
function FormInput({ label, value, onChange, type = 'text', placeholder = '' }: { label: string, value: string | number, onChange: (v: string) => void, type?: string, placeholder?: string }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input 
        type={type} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
    </div>
  );
}

function FormTextarea({ label, value, onChange, rows = 3 }: { label: string, value: string, onChange: (v: string) => void, rows?: number }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
    </div>
  );
}

function FormSelect({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
      >
        <option value="" disabled>Select...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

// --- Section Editors ---
function HomeEditor({ data, onChange }: { data: HomeContent, onChange: (d: HomeContent) => void }) {
  const update = (field: keyof HomeContent, value: any) => onChange({ ...data, [field]: value });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Home & About Section</h2>
      <FormInput label="Hero Title" value={data.title} onChange={(v) => update('title', v)} />
      <FormInput label="Hero Subtitle" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      <FormTextarea label="Introduction Paragraph 1" value={data.description1 || ''} onChange={(v) => update('description1', v)} rows={3} />
      <FormTextarea label="Introduction Paragraph 2" value={data.description2 || ''} onChange={(v) => update('description2', v)} rows={3} />
      
      <div className="mt-8 mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Stats</h3>
        <button onClick={() => update('stats', [...(data.stats||[]), {label: 'New Stat', value: '0'}])} className="text-blue-600 flex items-center gap-1 text-sm bg-blue-50 dark:bg-blue-900/30 py-1 px-3 rounded-md hover:bg-blue-100 transition-colors">
          <Plus size={16}/> Add Stat
        </button>
      </div>
      {(data.stats||[]).map((stat, idx) => (
        <div key={idx} className="flex gap-4 items-end mb-4 border border-gray-200 dark:border-gray-700 p-4 rounded-lg relative bg-gray-50/50 dark:bg-gray-800/50">
          <button onClick={() => { const ns = [...data.stats]; ns.splice(idx, 1); update('stats', ns); }} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
          <div className="flex-1">
            <FormInput label="Label (e.g. Years Exp)" value={stat.label} onChange={(v) => { const ns = [...data.stats]; ns[idx].label = v; update('stats', ns); }} />
          </div>
          <div className="flex-1">
            <FormInput label="Value (e.g. 5+)" value={stat.value} onChange={(v) => { const ns = [...data.stats]; ns[idx].value = v; update('stats', ns); }} />
          </div>
        </div>
      ))}

      <div className="mt-8 mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Highlights</h3>
        <button onClick={() => update('highlights', [...(data.highlights||[]), {icon: 'Code', title: 'New Highlight', description: ''}])} className="text-blue-600 flex items-center gap-1 text-sm bg-blue-50 dark:bg-blue-900/30 py-1 px-3 rounded-md hover:bg-blue-100 transition-colors">
          <Plus size={16}/> Add Highlight
        </button>
      </div>
      {(data.highlights||[]).map((hlt, idx) => (
        <div key={idx} className="mb-4 border border-gray-200 dark:border-gray-700 p-4 rounded-lg relative bg-gray-50/50 dark:bg-gray-800/50">
          <button onClick={() => { const nh = [...data.highlights]; nh.splice(idx, 1); update('highlights', nh); }} className="absolute top-4 right-4 text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
          <FormInput label="Icon Name (Lucide React)" value={hlt.icon} onChange={(v) => { const nh = [...data.highlights]; nh[idx].icon = v; update('highlights', nh); }} />
          <FormInput label="Title" value={hlt.title} onChange={(v) => { const nh = [...data.highlights]; nh[idx].title = v; update('highlights', nh); }} />
          <FormTextarea label="Description" value={hlt.description} onChange={(v) => { const nh = [...data.highlights]; nh[idx].description = v; update('highlights', nh); }} rows={2} />
        </div>
      ))}
    </div>
  );
}

function ExperienceEditor({ data, onChange }: { data: TimelineContent, onChange: (d: TimelineContent) => void }) {
  const update = (field: keyof TimelineContent, value: any) => onChange({ ...data, [field]: value });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Experience Timeline</h2>
      <FormInput label="Title" value={data.title} onChange={(v) => update('title', v)} />
      <FormInput label="Subtitle" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      
      <div className="mt-8 mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Experiences</h3>
        <button onClick={() => {
          const y = new Date().getFullYear();
          update('experiences', [...data.experiences, {
            company: 'New Company', position: '', 
            startMonth: 'January', startYear: y.toString(), 
            isCurrent: true, endMonth: 'December', endYear: y.toString(),
            period: `January ${y} - Present`, year: y, 
            description: '', achievements: [''], color: 'from-blue-500 to-cyan-500'
          }]);
        }} className="text-blue-600 flex items-center gap-1 text-sm bg-blue-50 dark:bg-blue-900/30 py-1 px-3 rounded-md hover:bg-blue-100 transition-colors">
          <Plus size={16}/> Add Experience
        </button>
      </div>
      
      {data.experiences.map((exp, idx) => {
        const updateExp = (field: keyof ExperienceItem, value: any) => {
          const newExps = [...data.experiences];
          newExps[idx] = { ...newExps[idx], [field]: value };
          update('experiences', newExps);
        };
        
        const handleDateChange = (field: keyof ExperienceItem, value: any) => {
          const newExps = [...data.experiences];
          const updated = { ...newExps[idx], [field]: value };
          
          const sMonth = updated.startMonth || 'January';
          const sYear = updated.startYear || new Date().getFullYear().toString();
          const eMonth = updated.endMonth || 'December';
          const eYear = updated.endYear || new Date().getFullYear().toString();
          
          const startStr = `${sMonth} ${sYear}`;
          const endStr = updated.isCurrent ? 'Present' : `${eMonth} ${eYear}`;
          updated.period = `${startStr} - ${endStr}`;
          
          const mIdx = MONTHS.indexOf(sMonth);
          updated.year = parseInt(sYear) + (mIdx !== -1 ? mIdx / 12 : 0);
          
          newExps[idx] = updated;
          update('experiences', newExps);
        };

        const sD = new Date(`${exp.startMonth || 'January'} 1, ${exp.startYear || new Date().getFullYear()}`);
        const eD = exp.isCurrent ? new Date() : new Date(`${exp.endMonth || 'December'} 1, ${exp.endYear || new Date().getFullYear()}`);
        const isInvalid = eD < sD;

        return (
          <div key={idx} className="mb-6 border border-gray-200 dark:border-gray-700 p-6 rounded-xl relative bg-gray-50/50 dark:bg-gray-800/50">
            <button onClick={() => { const nx = [...data.experiences]; nx.splice(idx, 1); update('experiences', nx); }} className="absolute top-6 right-6 text-red-500 hover:text-red-700 shadow-sm"><Trash2 size={20}/></button>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <FormInput label="Company" value={exp.company} onChange={(v) => updateExp('company', v)} />
              <FormInput label="Position" value={exp.position} onChange={(v) => updateExp('position', v)} />
            </div>

            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm relative mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Timeline Placement Dates</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Start Date</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FormSelect label="" value={exp.startMonth || 'January'} options={MONTHS} onChange={(v) => handleDateChange('startMonth', v)} />
                    </div>
                    <div className="flex-1">
                      <FormSelect label="" value={exp.startYear || new Date().getFullYear().toString()} options={YEARS} onChange={(v) => handleDateChange('startYear', v)} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-500">End Date</label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input type="checkbox" checked={exp.isCurrent || false} onChange={(e) => handleDateChange('isCurrent', e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                      Present
                    </label>
                  </div>
                  {!exp.isCurrent ? (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <FormSelect label="" value={exp.endMonth || 'December'} options={MONTHS} onChange={(v) => handleDateChange('endMonth', v)} />
                      </div>
                      <div className="flex-1">
                        <FormSelect label="" value={exp.endYear || new Date().getFullYear().toString()} options={YEARS} onChange={(v) => handleDateChange('endYear', v)} />
                      </div>
                    </div>
                  ) : (
                    <div className="py-2.5 px-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-sm italic">
                      Currently working here
                    </div>
                  )}
                </div>
              </div>
              
              {isInvalid && (
                <p className="text-red-500 text-sm mt-3 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded">Warning: The end date cannot be earlier than the start date.</p>
              )}
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Auto-generated Period string:</span> {exp.period} <br/>
                <span className="font-medium text-gray-700 dark:text-gray-300">Timeline Anchor Float:</span> {exp.year.toFixed(3)}
              </div>
            </div>
            <FormTextarea label="Description" value={exp.description} onChange={(v) => updateExp('description', v)} rows={3} />
            <FormInput label="Tailwind Gradient Classes (e.g. from-blue-500 to-cyan-500)" value={exp.color} onChange={(v) => updateExp('color', v)} />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Achievements / Bullets</label>
              {exp.achievements.map((ach, aIdx) => (
                <div key={aIdx} className="flex gap-2 items-center mb-2">
                  <div className="flex-1">
                    <input className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white" value={ach} onChange={(e) => {
                      const newAchs = [...exp.achievements];
                      newAchs[aIdx] = e.target.value;
                      updateExp('achievements', newAchs);
                    }}/>
                  </div>
                  <button onClick={() => {
                     const newAchs = [...exp.achievements];
                     newAchs.splice(aIdx, 1);
                     updateExp('achievements', newAchs);
                  }} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16}/></button>
                </div>
              ))}
              <button onClick={() => updateExp('achievements', [...exp.achievements, ''])} className="text-sm text-blue-600 mt-2 font-medium">+ Add Achievement</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProjectsEditor({ data, onChange }: { data: ProjectsContent, onChange: (d: ProjectsContent) => void }) {
  const update = (field: keyof ProjectsContent, value: any) => onChange({ ...data, [field]: value });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Projects Section</h2>
      <FormInput label="Title" value={data.title} onChange={(v) => update('title', v)} />
      <FormInput label="Subtitle" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      
      <div className="mt-8 mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project List</h3>
        <button onClick={() => update('list', [...data.list, {title: 'New Project', description: '', image: '', tags: [], github: '', live: ''}])} className="text-blue-600 flex items-center gap-1 text-sm bg-blue-50 dark:bg-blue-900/30 py-1 px-3 rounded-md hover:bg-blue-100 transition-colors">
          <Plus size={16}/> Add Project
        </button>
      </div>

      {data.list.map((proj, idx) => {
        const updateProj = (field: keyof ProjectItem, value: any) => {
          const newList = [...data.list];
          newList[idx] = { ...newList[idx], [field]: value };
          update('list', newList);
        };
        return (
          <div key={idx} className="mb-6 border border-gray-200 dark:border-gray-700 p-6 rounded-xl relative bg-gray-50/50 dark:bg-gray-800/50">
            <button onClick={() => { const nl = [...data.list]; nl.splice(idx, 1); update('list', nl); }} className="absolute top-6 right-6 text-red-500 hover:text-red-700"><Trash2 size={20}/></button>
            <FormInput label="Project Title" value={proj.title} onChange={(v) => updateProj('title', v)} />
            <FormTextarea label="Description" value={proj.description} onChange={(v) => updateProj('description', v)} rows={2} />
            <FormInput label="Image URL" value={proj.image} onChange={(v) => updateProj('image', v)} />
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput label="GitHub Link" value={proj.github} onChange={(v) => updateProj('github', v)} />
              <FormInput label="Live Demo Link" value={proj.live} onChange={(v) => updateProj('live', v)} />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tech Stack Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
              {proj.tags.map((tag, tIdx) => (
                <div key={tIdx} className="flex gap-1 items-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-sm">
                  <span>{tag}</span>
                  <button onClick={() => {
                     const nt = [...proj.tags];
                     nt.splice(tIdx, 1);
                     updateProj('tags', nt);
                  }} className="text-blue-500 hover:text-blue-800"><Trash2 size={12}/></button>
                </div>
              ))}
              </div>
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  placeholder="Type tag and press Enter" 
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val && !proj.tags.includes(val)) {
                        updateProj('tags', [...proj.tags, val]);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillsEditor({ data, onChange }: { data: SkillsContent, onChange: (d: SkillsContent) => void }) {
  const update = (field: keyof SkillsContent, value: any) => onChange({ ...data, [field]: value });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Skills Section</h2>
      <FormInput label="Title" value={data.title} onChange={(v) => update('title', v)} />
      <FormInput label="Subtitle" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      
      <div className="mt-8 mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Skill Categories</h3>
        <button onClick={() => update('categories', [...data.categories, {category: 'New Category', skills: []}])} className="text-blue-600 flex items-center gap-1 text-sm bg-blue-50 dark:bg-blue-900/30 py-1 px-3 rounded-md hover:bg-blue-100 transition-colors">
          <Plus size={16}/> Add Category
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {data.categories.map((cat, cIdx) => {
          const updateCat = (field: keyof SkillCategory, value: any) => {
            const newCats = [...data.categories];
            newCats[cIdx] = { ...newCats[cIdx], [field]: value };
            update('categories', newCats);
          };
          return (
            <div key={cIdx} className="border border-gray-200 dark:border-gray-700 p-5 rounded-xl relative bg-gray-50/50 dark:bg-gray-800/50">
              <button onClick={() => { const nc = [...data.categories]; nc.splice(cIdx, 1); update('categories', nc); }} className="absolute top-5 right-5 text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
              <FormInput label="Category Name" value={cat.category} onChange={(v) => updateCat('category', v)} />
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills & Proficiency (%)</label>
                  <button onClick={() => updateCat('skills', [...cat.skills, {name: 'New Skill', level: 50}])} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"><Plus size={14}/> Add Skill</button>
                </div>
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="flex gap-2 items-center mb-2">
                    <div className="flex-[2]">
                      <input className="w-full px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white" value={skill.name} onChange={(e) => {
                        const newSkills = [...cat.skills];
                        newSkills[sIdx].name = e.target.value;
                        updateCat('skills', newSkills);
                      }}/>
                    </div>
                    <div className="flex-1">
                      <input type="number" min="0" max="100" className="w-full px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white" value={skill.level.toString()} onChange={(e) => {
                        const newSkills = [...cat.skills];
                        newSkills[sIdx].level = parseInt(e.target.value) || 0;
                        updateCat('skills', newSkills);
                      }}/>
                    </div>
                    <button onClick={() => {
                       const newSkills = [...cat.skills];
                       newSkills.splice(sIdx, 1);
                       updateCat('skills', newSkills);
                    }} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactEditor({ data, onChange }: { data: ContactContent, onChange: (d: ContactContent) => void }) {
  const update = (field: keyof ContactContent, value: string) => onChange({ ...data, [field]: value });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Contact Section</h2>
      <FormInput label="Title" value={data.title} onChange={(v) => update('title', v)} />
      <FormTextarea label="Subtitle" value={data.subtitle} onChange={(v) => update('subtitle', v)} rows={2} />
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <FormInput label="Email address" value={data.email} onChange={(v) => update('email', v)} />
        <FormInput label="Phone number" value={data.phone} onChange={(v) => update('phone', v)} />
        <FormInput label="Location string" value={data.location} onChange={(v) => update('location', v)} />
      </div>
    </div>
  );
}

function SocialsEditor({ data, onChange }: { data: SocialsContent, onChange: (d: SocialsContent) => void }) {
  const update = (field: keyof SocialsContent, value: string) => onChange({ ...data, [field]: value });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Global Social Links & Resume</h2>
      <FormInput label="GitHub URL" value={data.github} onChange={(v) => update('github', v)} />
      <FormInput label="LinkedIn URL" value={data.linkedin} onChange={(v) => update('linkedin', v)} />
      <FormInput label="Twitter/X URL" value={data.twitter} onChange={(v) => update('twitter', v)} />
      
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resume / CV Document</h3>
        <FormInput label="Resume URL (Direct PDF link)" value={data.resume || ''} onChange={(v) => update('resume', v)} placeholder="https://example.com/resume.pdf" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">If provided, a "Resume" button will automatically appear in your Navigation bar and Homepage.</p>
      </div>
    </div>
  );
}


// --- Main Page Component ---
export function AdminPanelPage() {
  const { content, refreshContent } = useContent();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SiteContent | null>(null);
  const [jsonString, setJsonString] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setProgressText('Extracting text from PDF...');
    setMessage({ type: 'success', text: 'Uploading and analyzing resume with AI. This may take a minute...' });
    
    const stages = [
      'Extracting text from PDF...',
      'Mapping resume to Home section...',
      'Generating About & Summary...',
      'Structuring Experience Timeline...',
      'Categorizing Skills...',
      'Finalizing Content...'
    ];
    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      if (stageIdx < stages.length - 1) {
        setProgressText(stages[stageIdx]);
      }
    }, 4500);

    const token = localStorage.getItem('adminToken');
    
    const formDataObj = new FormData();
    formDataObj.append('file', file);
    
    try {
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj
      });
      
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to parse resume');
      
      setMessage({ type: 'success', text: 'Resume successfully analyzed and applied! Click "Save All Changes" to persist.' });
      
      if (resData.data) {
        setFormData(resData.data);
        setJsonString(JSON.stringify(resData.data, null, 2));
      } else {
        await refreshContent();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error processing resume.' });
    } finally {
      clearInterval(interval);
      setUploading(false);
      setProgressText('');
      e.target.value = '';
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch('/api/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) navigate('/login');
      } catch {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (content) {
      setFormData(content);
      setJsonString(JSON.stringify(content, null, 2));
    }
  }, [content]);

  const handleSectionUpdate = (section: keyof SiteContent, data: any) => {
    if (!formData) return;
    const newData = { ...formData, [section]: data };
    setFormData(newData);
    setJsonString(JSON.stringify(newData, null, 2));
    setMessage(null); // Clear errors dynamically
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setFormData(parsed);
      setMessage(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid JSON format' });
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    
    // Validate JSON before saving
    try {
      JSON.parse(jsonString);
    } catch {
      setMessage({ type: 'error', text: 'Cannot save: Invalid JSON format' });
      return;
    }

    setSaving(true);
    setMessage(null);
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: jsonString
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      setMessage({ type: 'success', text: 'Changes saved successfully! Redirecting to home...' });
      await refreshContent();
      
      // Short delay for visual feedback before redirect
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving changes. Check authentication.' });
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  if (!formData) return <div className="p-8 text-center dark:text-white">Loading content editor...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 pt-24 md:p-8 md:pt-28">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Website CMS</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all dynamic text and portfolio content.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors font-medium"
            >
              View Site
            </button>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium border border-transparent dark:border-gray-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Auto-Populate Upload Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800/50 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <FileUp size={20} />
              Auto-Populate from Resume
            </h3>
            <div className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              {uploading ? (
                <span className="flex items-center gap-2 font-medium text-blue-800 dark:text-blue-200">
                  <Loader2 className="animate-spin" size={16} /> 
                  {progressText}
                </span>
              ) : (
                "Upload your PDF resume to instantly map formatting into your dynamic sections using AI."
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
             <input type="file" id="resumeUpload" className="hidden" accept=".pdf" onChange={handleResumeUpload} disabled={uploading} />
             <label htmlFor="resumeUpload" className={`px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium cursor-pointer hover:bg-blue-700 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
               {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
               {uploading ? 'Analyzing...' : 'Upload PDF'}
             </label>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-thin">
          {TABS.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-medium capitalize whitespace-nowrap transition-all duration-200 ${
                activeTab === tab 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm'
              }`}
            >
              {tab === 'json' ? 'Raw JSON' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 mb-8 min-h-[500px]">
          {activeTab === 'home' && <HomeEditor data={formData.home} onChange={(d) => handleSectionUpdate('home', d)} />}
          {activeTab === 'experience' && <ExperienceEditor data={formData.timeline} onChange={(d) => handleSectionUpdate('timeline', d)} />}
          {activeTab === 'projects' && <ProjectsEditor data={formData.projects} onChange={(d) => handleSectionUpdate('projects', d)} />}
          {activeTab === 'skills' && <SkillsEditor data={formData.skills} onChange={(d) => handleSectionUpdate('skills', d)} />}
          {activeTab === 'contact' && <ContactEditor data={formData.contact} onChange={(d) => handleSectionUpdate('contact', d)} />}
          {activeTab === 'socials' && <SocialsEditor data={formData.socials} onChange={(d) => handleSectionUpdate('socials', d)} />}
          
          {activeTab === 'json' && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Advanced JSON Editor</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Raw database payload. Be careful mapping keys exactly.
              </p>
              <textarea 
                value={jsonString}
                onChange={handleJsonChange}
                rows={24}
                className="w-full px-4 py-4 font-mono text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-blue-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
              />
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              {message && (
                <span className={`px-4 py-2 rounded-lg text-sm font-medium animate-fade-in ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                  {message.text}
                </span>
              )}
            </div>
            <button 
              onClick={handleSave}
              disabled={saving || message?.text.includes('Invalid')}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none"
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
        
        {/* Spacer for fixed footer */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
