/**
 * Preset Data for POJ Handwriting Practice Generator
 * 
 * Each preset contains:
 * - title: Object with 'en' and 'poj' language variants
 * - text: Practice text content
 */
/**
 * Preset Data for POJ Handwriting Practice Generator
 * 
 * Each preset contains:
 * - title: Object with 'en' and 'poj' language variants
 * - text: Practice text content
 */
/**
 * Preset Data for POJ Handwriting Practice Generator
 * 
 * Each preset contains:
 * - title: Object with 'en' and 'poj' language variants
 * - text: Practice text content
 */
(function () {
    const PRESETS = {
        'empty': {
            preset_name: {
                en: 'Empty',
                poj: 'Khang--ê'
            },
            page_title: {
                en: '',
                poj: ''
            },
            text: ``
        },

        // Default practice text
        'default': {
            preset_name: {
                en: 'Default',
                poj: 'Chiàu-goân'
            },
            page_title: {
                en: 'POJ Handwriting Practice',
                poj: 'Liān-si̍p Siá Pe̍h-ōe-jī'
            },
            text: `Góa chiok kah-ì siá Pe̍h-ōe-jī.`,
            font: 'Lesson One',
            lineHeight: 26,
            guideStyle: 'normal',
            textStyle: 'grey',
            practiceMode: 'tracing',
            followingLines: 'fill'
        },

        // Vowel practice: A, I, U, O͘, E, O
        'vowels': {
            preset_name: {
                en: 'Vowels (A, I, U, O͘, E, O)',
                poj: 'Bó-im (A, I, U, O͘, E, O)'
            },
            page_title: {
                en: 'POJ Vowels',
                poj: 'Pe̍h-ōe-jī Bó-im'
            },
            text: `A A A A A A A   a a a a a a a a
I  I  I  I  I  I  I   i  i  i  i  i  i  i  i
U U U U U U U   u u u u u u u u
O͘ O͘ O͘ O͘ O͘ O͘ O͘   o͘ o͘ o͘ o͘ o͘ o͘ o͘
E E E E E E E E   e e e e e e e e
O O O O O O O   o o o o o o o o
A  I  U  O͘  E  O   a  i  u  o͘  e  o
A  I  U  O͘  E  O   a  i  u  o͘  e  o
A-î ū o͘-ê--bô?  A-î ū o͘-ê--bô?`,
            font: 'Lesson One',
            lineHeight: 26,
            guideStyle: 'normal',
            textStyle: 'grey',
            practiceMode: 'tracing',
            followingLines: 'fill'
        },

        // Consonant practice: P, Ph, M, B, T, Th, N, L, K, Kh, Ng, G, H, Ch, Chh, S, J
        'consonants': {
            preset_name: {
                en: 'Consonants (P, Ph, M, B...)',
                poj: 'Chú-im (P, Ph, M, B...)'
            },
            page_title: {
                en: 'POJ Consonants',
                poj: 'Pe̍h-ōe-jī Chú-im'
            },
            text: `P P P P P P P   p  p  p  p  p  p  p
Ph Ph Ph Ph   ph ph ph ph ph
M M M M M   m  m  m  m  m  m
B B B B B B B   b  b  b  b  b  b  b
T T T T T T T   t  t  t  t  t  t  t  t
Th Th Th Th Th   th th th th th
N N N N N N   n  n  n  n  n  n  n
L  L  L  L  L  L    l   l   l   l   l   l   l
K K K K K K K    k  k  k  k  k  k  k
Kh Kh Kh Kh   kh kh kh kh kh
Ng Ng Ng Ng   ng ng ng ng ng
G G G G G G   g  g  g  g  g  g  g
H H H H H H   h  h  h  h  h  h  h
Ch Ch Ch Ch  ch ch ch ch ch
Chh Chh Chh  chh chh chh chh
S S S S S S S   s  s  s  s  s  s  s
J J J J J J J   j   j   j   j   j   j   j
A-pô tì bō-á.  Gô-á mo͘ n̂g-n̂g.`,
            font: 'Lesson One',
            lineHeight: 26,
            guideStyle: 'normal',
            textStyle: 'grey',
            practiceMode: 'tracing',
            followingLines: 'fill'
        },

        // Tone marks practice: All 8 tones for each vowel
        'tones': {
            preset_name: {
                en: 'Tone Marks (A, Á, À, Ah...)',
                poj: 'Siaⁿ-tiāu (A, Á, À, Ah...)'
            },
            page_title: {
                en: 'POJ Tone Marks',
                poj: 'Pe̍h-ōe-jī Siaⁿ-tiāu'
            },
            text: `A   Á   À   Ah     Â   Ā   A̍h   Ă
a   á    à   ah      â   ā    a̍h   ă
I    Í    Ì   Ih      Î    Ī    I̍h   Ĭ
i     í     ì    ih      î    ī     i̍h    ĭ
U   Ú   Ù   Uh    Û   Ū   U̍h   Ŭ
u   ú    ù    uh    û   ū    u̍h   ŭ
O͘   Ó͘   Ò͘   O͘h   Ô͘   Ō͘   O̍͘h   Ŏ͘
o͘    ó͘   ò͘   o͘h    ô͘    ō͘   o̍͘h    ŏ͘
sai  hó͘  pà  pih  kâu  chhiūⁿ lo̍k
E    É    È   Eh     Ê    Ē   E̍h   Ĕ
e    é    è   eh      ê    ē   e̍h   ĕ
O   Ó   Ò   Oh     Ô   Ō   O̍h   Ŏ
o    ó   ò    oh      ô   ō    o̍h   ŏ
M   Ḿ   M̀   Mh   M̂   M̄   M̍h   M̆
m   ḿ   m̀   mh    m̂   m̄   m̍h   m̆
Ng Ńg Ǹg Ngh   N̂g N̄g N̍gh N̆g
ng  ńg  ǹg  ngh  n̂g  n̄g  n̍gh  n̆g
Chăng góa ū chia̍h jĭn-jín.`,
            font: 'Lesson One',
            lineHeight: 26,
            guideStyle: 'normal',
            textStyle: 'grey',
            practiceMode: 'tracing',
            followingLines: 'fill'
        },

        // Nasal vowels practice: Aⁿ, Iⁿ, Oⁿ, Eⁿ
        'nasals': {
            preset_name: {
                en: 'Nasal Vowels (Aⁿ, Iⁿ, Oⁿ...)',
                poj: 'Phīⁿ-im Hòa Bó-im Jī-bóe (Aⁿ, Iⁿ, Oⁿ...)'
            },
            page_title: {
                en: 'POJ Nasal Vowels',
                poj: 'Phīⁿ-im Hòa Ko͘ Bó-im Jī-bóe'
            },
            text: `Aⁿ  Aⁿ  Aⁿ  Aⁿ  Aⁿ  Aⁿ  Aⁿ  Aⁿ
aⁿ  aⁿ  aⁿ  aⁿ  aⁿ  aⁿ  aⁿ  aⁿ  aⁿ
Iⁿ  Iⁿ  Iⁿ  Iⁿ  Iⁿ  Iⁿ  Iⁿ  Iⁿ  Iⁿ
iⁿ  iⁿ  iⁿ  iⁿ  iⁿ  iⁿ  iⁿ  iⁿ  iⁿ  iⁿ  iⁿ
Oⁿ  Oⁿ  Oⁿ  Oⁿ  Oⁿ  Oⁿ  Oⁿ  Oⁿ
oⁿ  oⁿ  oⁿ  oⁿ  oⁿ  oⁿ  oⁿ  oⁿ  oⁿ
Eⁿ  Eⁿ  Eⁿ  Eⁿ  Eⁿ  Eⁿ  Eⁿ  Eⁿ  Eⁿ
eⁿ  eⁿ  eⁿ  eⁿ  eⁿ  eⁿ  eⁿ  eⁿ  eⁿ`,
            font: 'Lesson One',
            lineHeight: 26,
            guideStyle: 'normal',
            textStyle: 'grey',
            practiceMode: 'tracing',
            followingLines: 'fill'
        },

        // Nasal compound vowels practice: Aiⁿ, Auⁿ, Iaⁿ, Iuⁿ, Oaⁿ
        'nasal_compounds': {
            preset_name: {
                en: 'Nasal Diphthongs (Aiⁿ, Auⁿ, Iaⁿ, Iuⁿ...)',
                poj: 'Phīⁿ-im Hòa Ho̍k Bó-im Jī-bóe (Aiⁿ, Auⁿ, Iaⁿ, Iuⁿ...)'
            },
            page_title: {
                en: 'POJ Nasal Diphthongs',
                poj: 'Phīⁿ-im Hòa Ho̍k Bó-im Jī-bóe'
            },
            text: `Aiⁿ  Aiⁿ  Aiⁿ  Aiⁿ  Aiⁿ  Aiⁿ  Aiⁿ
aiⁿ  aiⁿ  aiⁿ  aiⁿ  aiⁿ  aiⁿ  aiⁿ
Auⁿ  Auⁿ  Auⁿ  Auⁿ  Auⁿ  Auⁿ
auⁿ  auⁿ  auⁿ  auⁿ  auⁿ  auⁿ
Iaⁿ  Iaⁿ  Iaⁿ  Iaⁿ  Iaⁿ  Iaⁿ  Iaⁿ
iaⁿ  iaⁿ  iaⁿ  iaⁿ  iaⁿ  iaⁿ  iaⁿ
Iuⁿ  Iuⁿ  Iuⁿ  Iuⁿ  Iuⁿ  Iuⁿ  Iuⁿ
iuⁿ  iuⁿ  iuⁿ  iuⁿ  iuⁿ  iuⁿ  iuⁿ

Iauⁿ  Iauⁿ  Iauⁿ  Iauⁿ  Iauⁿ
iauⁿ  iauⁿ  iauⁿ  iauⁿ  iauⁿ  iauⁿ
Uiⁿ  Uiⁿ  Uiⁿ  Uiⁿ  Uiⁿ  Uiⁿ  Uiⁿ
uiⁿ  uiⁿ  uiⁿ  uiⁿ  uiⁿ  uiⁿ  uiⁿ
Oaⁿ  Oaⁿ  Oaⁿ  Oaⁿ  Oaⁿ  Oaⁿ
oaⁿ  oaⁿ  oaⁿ  oaⁿ  oaⁿ  oaⁿ
Oaiⁿ  Oaiⁿ  Oaiⁿ  Oaiⁿ  Oaiⁿ
oaiⁿ  oaiⁿ  oaiⁿ  oaiⁿ  oaiⁿ  oaiⁿ`,
            font: 'Lesson One',
            lineHeight: 26,
            guideStyle: 'normal',
            textStyle: 'grey',
            practiceMode: 'tracing',
            followingLines: 'fill'
        },

        // Nasal codas practice: Am, An, Ang, Im, In...
        'nasal_codas': {
            preset_name: {
                en: 'Nasal Codas (-m, -n, -ng)',
                poj: 'Phīⁿ Chú-im Bóe-liu Jī-bóe (-m, -n, -ng)'
            },
            page_title: {
                en: 'POJ Nasal Codas',
                poj: 'Phīⁿ Chú-im Bóe-liu Jī-bóe'
            },
            text: `Am Am Am Am  am am am am
An An An An  an an an an an
Ang Ang Ang  ang ang ang
Im Im Im Im  im im im im im
In In In In In  in in in in in in
Iam Iam Iam  iam iam iam
Iang Iang Iang iang iang iang
Iong Iong Iong iong iong iong
Un Un Un Un  un un un un un
Om Om Om Om  om om om om
Ong Ong Ong  ong ong ong
Oan Oan Oan  oan oan oan
Oang Oang  oang oang oang 
Ian Ian Ian  ian ian ian ian
Eng Eng Eng  eng eng eng eng`,
            font: 'Lesson One',
            lineHeight: 26,
            guideStyle: 'normal',
            textStyle: 'grey',
            practiceMode: 'tracing',
            followingLines: 'fill'
        },

        // Stop codas practice: ap, at, ak, ah, ip, it...
        'basic_stop_codas': {
            preset_name: {
                en: 'Basic Stop Codas (ap, at, ak, ah, ip, it...)',
                poj: 'Ki-pún Sok-im Jī-bóe (ap, at, ak, ah, ip, it...)'
            },
            page_title: {
                en: 'Basic Stop Codas',
                poj: 'Ki-pún Sok-im Jī-bóe'
            },
            text: `Ap Ap Ap Ap  ap ap ap ap ap
At At At At At  at at at at at
Ak Ak Ak Ak Ak  ak ak ak ak ak
Ah Ah Ah Ah  ah ah ah ah ah
Ip Ip Ip Ip Ip  ip ip ip ip ip ip
It It It It It It  it it it it it it it
Ih Ih Ih Ih Ih  ih ih ih ih ih ih


Ut Ut Ut Ut Ut  ut ut ut ut ut
Uh Uh Uh Uh Uh  uh uh uh uh
Op Op Op Op  op op op op op
Ok Ok Ok Ok  ok ok ok ok ok
O͘h O͘h O͘h O͘h  o͘h o͘h o͘h o͘h o͘h
Eh Eh Eh Eh Eh  eh eh eh eh eh
Oh Oh Oh Oh  oh oh oh oh oh`,
            font: 'Lesson One',
            lineHeight: 26,
            guideStyle: 'normal',
            textStyle: 'grey',
            practiceMode: 'tracing',
            followingLines: 'fill'
        },

        // PTK stop codas practice
        'ptk_stop_codas': {
            preset_name: {
                en: 'PTK Stop Codas (Ap, At, Ak, Ip, It...)',
                poj: 'PTK Sok-im Jī-bóe (Ap, At, Ak, Ip, It...)'
            },
            page_title: {
                en: 'PTK Stop Codas',
                poj: 'PTK Sok-im Jī-bóe'
            },
            text: `Ap Ap Ap Ap  ap ap ap ap ap
At At At At At  at at at at at
Ak Ak Ak Ak Ak  ak ak ak ak ak
Ip Ip Ip Ip Ip  ip ip ip ip ip ip
It It It It It It  it it it it it it it
Iap Iap Iap  iap iap iap iap
Iak Iak Iak Iak  iak iak iak iak
Iok Iok Iok Iok  iok iok iok iok

Ut Ut Ut Ut Ut  ut ut ut ut ut
Op Op Op Op  op op op op op
Ok Ok Ok Ok  ok ok ok ok ok
Oat Oat Oat  oat oat oat oat
Oak Oak Oak  oak oak oak oak

Iat Iat Iat Iat  iat iat iat iat
Ek Ek Ek Ek Ek  ek ek ek ek ek`,
            font: 'Lesson One',
            lineHeight: 26,
            guideStyle: 'normal',
            textStyle: 'grey',
            practiceMode: 'tracing',
            followingLines: 'fill'
        }
    };

    window.App.Data.Presets = PRESETS;
})();
