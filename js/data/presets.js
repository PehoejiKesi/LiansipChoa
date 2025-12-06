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
            title: {
                en: '',
                poj: ''
            },
            text: ``
        },

        // Default practice text
        'default': {
            title: {
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
            title: {
                en: 'POJ Vowels Practice',
                poj: 'Liān-si̍p Siá Pe̍h-ōe-jī Bó-im'
            },
            text: `A A A A A A A   a a a a a a a
I  I  I  I  I  I  I   i  i  i  i  i  i  i
U U U U U U U   u u u u u u u
O͘ O͘ O͘ O͘ O͘ O͘ O͘   o͘ o͘ o͘ o͘ o͘ o͘ o͘
E E E E E E E E   e e e e e e e e
O O O O O O O   o o o o o o o
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
            title: {
                en: 'POJ Consonants Practice',
                poj: 'Liān-si̍p Siá Pe̍h-ōe-jī Chú-im'
            },
            text: `P P P P P P P   p  p  p  p  p  p  p
Ph Ph Ph Ph   ph ph ph ph ph
M M M M M   m  m  m  m  m  m
B B B B B B B   b  b  b  b  b  b  b
T T T T T T T   t  t  t  t  t  t  t
Th Th Th Th Th   th th th th th
N N N N N N   n  n  n  n  n  n
L  L  L  L  L  L    l   l   l   l   l   l   l
K K K K K K K    k  k  k  k  k  k  k
Kh Kh Kh Kh   kh kh kh kh kh
Ng Ng Ng Ng   ng ng ng ng ng
G G G G G G   g  g  g  g  g  g
H H H H H H   h  h  h  h  h  h
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
            title: {
                en: 'POJ Tone Marks Practice',
                poj: 'Liān-si̍p Siá Pe̍h-ōe-jī Siaⁿ-tiāu'
            },
            text: `A   Á   À   Ah   Â   Ā   A̍h   Ă
a   á   à   ah   â   ā   a̍h   ă
I   Í   Ì   Ih   Î   Ī   I̍h   Ĭ
i   í   ì   ih   î   ī   i̍h   ĭ
U   Ú   Ù   Uh   Û   Ū   U̍h   Ŭ
u   ú   ù   uh   û   ū   u̍h   ŭ
O͘   Ó͘   Ò͘   O͘h   Ô͘   Ō͘   O̍͘h   Ŏ͘
o͘   ó͘   ò͘   o͘h   ô͘   ō͘   o̍͘h   ŏ͘
sai hó͘ pà pih  kâu chhiūⁿ lo̍k
E   É   È   Eh   Ê   Ē   E̍h   Ĕ
e   é   è   eh   ê   ē   e̍h   ĕ
O   Ó   Ò   Oh   Ô   Ō   O̍h   Ŏ
o   ó   ò   oh   ô   ō   o̍h   ŏ
M   Ḿ   M̀   Mh   M̂   M̄   M̍h   M̆
m   ḿ   m̀   mh   m̂   m̄   m̍h   m̆
Ng Ńg Ǹg Ngh  N̂g N̄g N̍gh N̆g
ng  ńg  ǹg  ngh  n̂g  n̄g  n̍gh  n̆g
Chăng góa ū chia̍h jĭn-jín.`,
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
