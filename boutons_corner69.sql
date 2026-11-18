-- ============================================================
--  CORNER69 - TOUS LES BOUTONS ET TEXTES DU BOT TELEGRAM
--  A coller d'un bloc dans SQL Editor, puis Run.
--  Rejouable : on peut le relancer sans rien dupliquer.
--  Aucun drop de table, aucune modification des tables boutique.
-- ============================================================

-- ============================================================
--  1. LES ECRANS DE MENU
-- ============================================================
insert into public.menus (slug, caption, version) values
('accueil', 'Bienvenue chez,
CORNER69

Simple rapide et efficace, ici vous en avez pour tous les goûts !

🥇 RAPIDE ET DISCRET
💶 PAIEMENT CASH
🕐 7J/7 - 12H/00H

✅ NOS SERVICES :

• 🚗 LIVRAISON RAPIDE ⚡
> Lyon et ses alentours (69)
> Rhône-Alpes, Suisse (Sur devis)

• 📍 MEET-UP (69) 🤝
> Adresse discrète
> Promos exclusives

• 📦 ENVOI POSTAL ✈️
> France 🇫🇷
> Europe 🇪🇺

📱 Menu/Infos sur la Mini App 🎆

🔌 Restez branché pour ne rien manquer !

👇 Choisis une option 👇', 1),

('services', '✅ NOS SERVICES :

• 🚗 LIVRAISON RAPIDE ⚡
> Lyon et ses alentours (69)
> Rhône-Alpes, Suisse (Sur devis)

• 📍 MEET-UP (69) 🤝
> Adresse discrète
> Promos exclusives

• 📦 ENVOI POSTAL ✈️
> France 🇫🇷
> Europe 🇪🇺


👇 Choisis un service 👇', 1),

('livraison', '🚗 LIVRAISON RAPIDE ⚡

🥇 Rapide et discret
💶 Paiement cash
🕐 7J/7 — 12H/00H

📍 LYON (69)
💶 Min. 40€  •  🕐 20~30m

📍 ALENTOURS (69)
💶 Min. 100€  •  🕐 ~30m

📍 RHÔNE-ALPES (38/42/74/73/01/07/26)
💶 Min. 500€  •  🕐 à estimer

📍 SUISSE 🇨🇭
💶 Min. 1000€  •  🕐 à estimer


📲 Contact : @Sully9647', 1),

('meetup', '📍 MEET-UP (69)(74) 🤝

> Adresse discrète
> Promo exclusive


📲 Contact : @Sully9647', 1),

('postal', '📦 ENVOI POSTAL ✈️

🗓 Envoi du lundi au jeudi
✅ Livraison sous 24/72H

🇫🇷 France — Min. 100€
🇪🇺 Europe — Min. 250€

📦 Frais d''envoi
 • La Poste +10€
    └ Nom / Prénom + Adresse
 • Mondial Relay +20€
    └ Nom/Prénom (facultatif)
    └ Mail + Point relais

⚠️ À savoir
✅ Emballage discret, 3x sous vide
✅ Remboursement si colis non livré
✅ Taux de réussite 99%


📲 Contact : @Sully9647', 1),

('canaux', '🔗 NOS CANAUX

Rejoins-nous sur nos canaux officiels 👇', 1),

('infos', 'ℹ️ INFOS


📲 Contact : @Sully9647', 1)
on conflict (slug) do nothing;


-- ============================================================
--  2. LES BOUTONS
--  On vide d'abord les boutons des ecrans concernes : ainsi
--  le fichier reste rejouable et la disposition est exacte.
-- ============================================================
delete from public.menu_buttons
where menu_id in (
  select id from public.menus
  where slug in ('accueil','services','livraison','meetup','postal','canaux','infos')
);

-- --- ACCUEIL -------------------------------------------------
--  1re ligne  : MINI APP - MENU (pleine largeur)
--  2e ligne   : Nos services | Nos canaux (2 colonnes)
--  3e ligne   : CONTACT TELEGRAM (pleine largeur, lien)
insert into public.menu_buttons (menu_id, label, action_type, action_value, row_index, col_index)
select m.id, v.label, v.action_type, v.action_value, v.row_index, v.col_index
from public.menus m
cross join (values
  ('🪐 MINI APP - MENU 🛰️', 'callback', 'menu:miniapp',        0, 0),
  ('✅ Nos services',       'callback', 'menu:services',       1, 0),
  ('🔗 Nos canaux',         'callback', 'menu:canaux',         1, 1),
  ('📲 CONTACT TELEGRAM 🛒','url',      'https://t.me/Sully9647', 2, 0)
) as v(label, action_type, action_value, row_index, col_index)
where m.slug = 'accueil';

-- --- NOS SERVICES --------------------------------------------
--  Les 4 services, 2 par ligne, plus le retour.
insert into public.menu_buttons (menu_id, label, action_type, action_value, row_index, col_index)
select m.id, v.label, v.action_type, v.action_value, v.row_index, v.col_index
from public.menus m
cross join (values
  ('🚗 Livraison',      'callback', 'menu:livraison', 0, 0),
  ('🏪 Meet-up',        'callback', 'menu:meetup',    0, 1),
  ('📦 Envoi postal',   'callback', 'menu:postal',    1, 0),
  ('ℹ️ Infos',           'callback', 'menu:infos',     1, 1),
  ('◀️ Retour au menu', 'callback', 'menu:accueil',   2, 0)
) as v(label, action_type, action_value, row_index, col_index)
where m.slug = 'services';

-- --- RETOUR AU MENU sur chaque ecran detaille ----------------
insert into public.menu_buttons (menu_id, label, action_type, action_value, row_index, col_index)
select m.id, '◀️ Retour au menu', 'callback', 'menu:accueil', 9, 0
from public.menus m
where m.slug in ('livraison','meetup','postal','infos');

-- --- NOS CANAUX : les liens --------------------------------
--  (retire l'ancien libelle LAPHARMA69 s'il est encore la)
update public.menu_buttons
set action_value = 'https://t.me/Sully9647'
where label = '📲 CONTACT TELEGRAM';

delete from public.menu_buttons
where menu_id = (select id from public.menus where slug = 'canaux')
  and label <> '◀️ Retour au menu';

insert into public.menu_buttons (menu_id, label, action_type, action_value, row_index, col_index)
select m.id, v.label, v.action_type, v.action_value, v.row_index, v.col_index
from public.menus m
cross join (values
  ('📲 CONTACT TELEGRAM', 'url', 'https://t.me/Sully9647',            0, 0),
  ('📢 Canal Telegram',   'url', 'https://t.me/+H15PSwqVM1o2ZWZk',   1, 0),
  ('◀️ Retour au menu',   'callback', 'menu:accueil',                 2, 0)
) as v(label, action_type, action_value, row_index, col_index)
where m.slug = 'canaux';


-- ============================================================
--  3. CONTROLE - tu dois voir tous les ecrans et leurs boutons
-- ============================================================
select m.slug                              as ecran,
       b.row_index                         as ligne,
       b.col_index                         as colonne,
       b.label                             as bouton,
       b.action_type                       as type,
       b.action_value                      as action
from public.menus m
join public.menu_buttons b on b.menu_id = m.id
order by m.slug, b.row_index, b.col_index;
