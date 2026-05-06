import artisans from '../../data/artisans.json'

export const mockClients = [
  { id: 1, nom: 'Sara Mernissi', phone: '0612345678', ville: 'Agadir', role: 'client', status: 'Actif', date: '2026-04-02' },
  { id: 2, nom: 'Karim Bennis', phone: '0711122233', ville: 'Casablanca', role: 'client', status: 'Actif', date: '2026-04-04' },
  { id: 3, nom: 'Aicha Lamrani', phone: '0522334455', ville: 'Rabat', role: 'client', status: 'Banni', date: '2026-04-09' },
  { id: 4, nom: 'Omar Haddad', phone: '0667788990', ville: 'Marrakech', role: 'client', status: 'Actif', date: '2026-04-14' },
]

export const mockProviders = artisans.map((artisan, index) => ({
  id: artisan.id,
  nom: artisan.name,
  categorie: artisan.category,
  ville: artisan.city,
  phone: artisan.phone,
  status: index < 3 ? 'Approuvé' : index === 3 ? 'Rejeté' : 'En attente',
}))

export const mockBookings = [
  { id: 1, client: 'Sara Mernissi', provider: 'Youssef El Fassi', service: 'Diagnostic', status: 'pending', date: '2026-05-01', amount: 180 },
  { id: 2, client: 'Karim Bennis', provider: 'Ahmed Benali', service: 'Installation', status: 'confirmed', date: '2026-05-02', amount: 320 },
  { id: 3, client: 'Omar Haddad', provider: 'Nabil Cherkaoui', service: 'Urgence', status: 'done', date: '2026-05-03', amount: 450 },
  { id: 4, client: 'Aicha Lamrani', provider: 'Hassan Tazi', service: 'Réparation', status: 'cancelled', date: '2026-05-04', amount: 0 },
  { id: 5, client: 'Sara Mernissi', provider: 'Rachid Ouali', service: 'Entretien', status: 'done', date: '2026-05-05', amount: 220 },
]

export const mockReviews = [
  { id: 1, client: 'Sara Mernissi', provider: 'Youssef El Fassi', rating: 5, comment: 'Travail propre et rapide.', date: '2026-05-01', status: 'En attente' },
  { id: 2, client: 'Karim Bennis', provider: 'Ahmed Benali', rating: 4, comment: 'Bon service, ponctuel.', date: '2026-05-02', status: 'Approuvé' },
  { id: 3, client: 'Omar Haddad', provider: 'Nabil Cherkaoui', rating: 5, comment: 'Excellent diagnostic.', date: '2026-05-03', status: 'Approuvé' },
  { id: 4, client: 'Aicha Lamrani', provider: 'Hassan Tazi', rating: 2, comment: 'Rendez-vous manqué.', date: '2026-05-04', status: 'Supprimé' },
]
