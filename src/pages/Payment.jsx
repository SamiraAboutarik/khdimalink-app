import { ArrowLeft, CheckCircle, Shield, Lock, Smartphone, CreditCard, Banknote, Building2, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const METHODS = [
  {
    id: 'cash',
    icon: '💵',
    name: 'Cash à la livraison',
    nameAr: 'الدفع نقداً عند الخدمة',
    desc: 'Payez directement l\'artisan après la prestation. Demandez toujours un reçu.',
    badge: 'Populaire',
    badgeColor: 'bg-brand-green/15 text-brand-green',
    steps: ['Service terminé', 'Artisan présente la facture', 'Paiement en espèces', 'Reçu remis'],
    color: 'border-brand-green/20',
    available: true,
  },
  {
    id: 'cmi',
    icon: '💳',
    name: 'CMI / Carte bancaire',
    nameAr: 'البطاقة البنكية CMI',
    desc: 'Paiement sécurisé via le réseau CMI (Centre Monétique Interbancaire). Compatible CIH, Attijariwafa, BMCE...',
    badge: 'Sécurisé',
    badgeColor: 'bg-teal/15 text-teal',
    steps: ['Cliquez "Payer"', 'Redirigé vers CMI', 'Entrez vos infos carte', 'Confirmation SMS'],
    color: 'border-teal/20',
    available: true,
  },
  {
    id: 'cih',
    icon: '📱',
    name: 'CIH Mobile / Bankily',
    nameAr: 'سي إتش موبايل / بانكيلي',
    desc: 'Payez via votre application CIH Mobile ou Bankily en scannant un QR Code ou en entrant le numéro de l\'artisan.',
    badge: 'Mobile',
    badgeColor: 'bg-blue-500/15 text-blue-400',
    steps: ['Ouvrez Bankily/CIH', 'Scanner QR ou entrer numéro', 'Valider le montant', 'Confirmation immédiate'],
    color: 'border-blue-500/20',
    available: true,
  },
  {
    id: 'wafacash',
    icon: '🏦',
    name: 'Wafacash / Mandat',
    nameAr: 'وفاكاش',
    desc: 'Transfert d\'argent via les agences Wafacash présentes partout au Maroc. Idéal sans compte bancaire.',
    badge: 'Sans compte',
    badgeColor: 'bg-amber-500/15 text-amber-400',
    steps: ['Allez en agence Wafacash', 'Donnez le N° artisan', 'Payez le montant + frais', 'Code de retrait envoyé'],
    color: 'border-amber-500/20',
    available: true,
  },
  {
    id: 'payzone',
    icon: '📲',
    name: 'PayZone / M-Wallet',
    nameAr: 'باي زون / محفظة إلكترونية',
    desc: 'Portefeuille électronique marocain (M-Wallet conforme BAM). Rechargeable via Orange Money, Inwi Money...',
    badge: 'Bientôt',
    badgeColor: 'bg-slate-500/15 text-slate-400',
    steps: ['Créez un M-Wallet', 'Rechargez via opérateur', 'Paiement instantané', 'Historique en app'],
    color: 'border-slate-500/20',
    available: false,
  },
]

const SECURITY = [
  { icon: Lock,        title: 'Chiffrement SSL/TLS',       desc: 'Toutes les transactions sont chiffrées en TLS 1.3.' },
  { icon: Shield,      title: 'Conforme BAM',               desc: 'Respect des normes Bank Al-Maghrib pour la monétique.' },
  { icon: Smartphone,  title: 'Authentification 2FA',       desc: 'Code OTP SMS à chaque paiement en ligne.' },
  { icon: CheckCircle, title: 'Protection acheteur',        desc: 'Remboursement garanti en cas de litige non résolu.' },
]

export default function Payment() {
  const navigate = useNavigate()
  const { lang } = useApp()

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white py-4 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">{lang === 'ar' ? 'رجوع' : 'Retour'}</span>
        </button>

        {/* Header */}
        <div className="mb-5 animate-fadeInUp">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={20} className="text-teal" />
            <h1 className="text-xl font-display font-bold text-white">
              {lang === 'ar' ? 'طرق الدفع الإلكتروني' : 'Paiement en ligne'}
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            {lang === 'ar'
              ? 'ادفع بأمان وسرعة مع KhedmaLink'
              : 'Plusieurs méthodes sécurisées, adaptées à tous les profils au Maroc'}
          </p>
        </div>

        {/* Methods */}
        <div className="space-y-3 mb-6">
          {METHODS.map((m, i) => (
            <div key={m.id}
              className={`glass rounded-2xl p-4 border animate-fadeInUp anim-delay-${i + 1}
                ${m.color} ${!m.available ? 'opacity-60' : ''}`}>
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white text-sm">
                      {lang === 'ar' ? m.nameAr : m.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>

              {/* Steps */}
              <div className="flex items-center gap-1 flex-wrap">
                {m.steps.map((step, j) => (
                  <div key={j} className="flex items-center gap-1">
                    <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5">
                      <span className="text-[9px] font-bold text-teal">{j + 1}</span>
                      <span className="text-[9px] text-slate-300">{step}</span>
                    </div>
                    {j < m.steps.length - 1 && <span className="text-slate-600 text-[10px]">→</span>}
                  </div>
                ))}
              </div>

              {!m.available && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <AlertCircle size={11} />
                  Disponible prochainement
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Security section */}
        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp border border-teal/10">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Shield size={15} className="text-teal" />
            {lang === 'ar' ? 'الأمان والحماية' : 'Sécurité & Protection'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {SECURITY.map((sec, i) => (
              <div key={i} className="bg-white/4 rounded-xl p-3">
                <sec.icon size={14} className="text-teal mb-1.5" />
                <p className="text-xs font-semibold text-white mb-0.5">{sec.title}</p>
                <p className="text-[10px] text-slate-400 leading-snug">{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BAM compliance note */}
        <div className="glass rounded-xl p-3 mb-6 border border-amber-400/20 animate-fadeInUp">
          <div className="flex gap-2">
            <Building2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-400 mb-0.5">
                {lang === 'ar' ? 'متوافق مع بنك المغرب' : 'Conformité Bank Al-Maghrib'}
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'جميع عمليات الدفع الإلكتروني تتم وفق أنظمة بنك المغرب وقوانين حماية البيانات الشخصية (09-08).'
                  : 'Toutes les transactions en ligne respectent la réglementation de Bank Al-Maghrib et la loi 09-08 sur la protection des données personnelles.'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button onClick={() => navigate(-1)}
          className="w-full gradient-orange py-4 rounded-xl font-bold text-white shadow-orange
            hover:opacity-90 transition-all flex items-center justify-center gap-2">
          <CheckCircle size={18} />
          {lang === 'ar' ? 'العودة وإتمام الحجز' : 'Retour et confirmer ma réservation'}
        </button>
      </div>
    </div>
  )
}
