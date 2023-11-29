import exp from 'constants';
import { writable } from 'svelte/store'
import type { Person, MessageFeed } from '../lib/chat.model';

export const mock_user_list = writable<Array<Person>>([]);
export const mock_user = writable();
export const mock_friends = writable<Array<Person>>([]);
export const mock_blocked = writable<Array<Person>>([]);
export const mock_priv_msg = writable([{}]);
export const mock_channels = writable([{}]);



mock_user.set({
    "id": 1,
    "nickname": "mortiz-d",
    "isRegistered": false,
    "avatar": "https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg",
    "two_factor_auth_secret": " ",
    "two_factor_auth_enabled": false
});

mock_blocked.set([
  {
    "id": 6,
    "nickname": "mtacuna",
    "isRegistered": false,
    "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/mtacuna.jpg",
    "two_factor_auth_secret": " ",
    "two_factor_auth_enabled": false
  }
])

mock_friends.set([
    {
        "id": 2,
        "nickname": "vicmarti",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/vicmarti.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    },
    {
        "id": 8,
        "nickname": "priezu-m",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/priezu-m.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    },
    {
      "id": 3,
      "nickname": "aborbol",
      "isRegistered": false,
      "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/aborbol.jpg",
      "two_factor_auth_secret": " ",
      "two_factor_auth_enabled": false
  },
  {
      "id": 4,
      "nickname": "josuna",
      "isRegistered": false,
      "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/josuna.jpg",
      "two_factor_auth_secret": " ",
      "two_factor_auth_enabled": false
  },
  {
      "id": 5,
      "nickname": "msantos-",
      "isRegistered": false,
      "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/msantos-.jpg",
      "two_factor_auth_secret": " ",
      "two_factor_auth_enabled": false
  },
]);

mock_priv_msg.set([
    {
        "id": 1,
        "content": "¡Hola, qué tal!",
        "created_at": "2023-11-27T20:18:44.789Z",
        "sender": {
          "id": 1,
          "nickname": "mortiz-d"
        },
        "receiver": {
          "id": 2,
          "nickname": "vicmarti"
        }
      },
      {
        "id": 2,
        "content": "¡Hola! ¿Cómo estás?",
        "created_at": "2023-11-27T20:20:00.000Z",
        "sender": {
          "id": 2,
          "nickname": "vicmarti"
        },
        "receiver": {
          "id": 1,
          "nickname": "mortiz-d"
        }
      },
      {
        "id": 3,
        "content": "Estoy bien, ¿y tú?",
        "created_at": "2023-11-27T20:22:30.000Z",
        "sender": {
          "id": 1,
          "nickname": "mortiz-d"
        },
        "receiver": {
          "id": 2,
          "nickname": "vicmarti"
        }
      },
      {
        "id": 4,
        "content": "¡Genial, gracias!",
        "created_at": "2023-11-27T20:25:10.000Z",
        "sender": {
          "id": 2,
          "nickname": "vicmarti"
        },
        "receiver": {
          "id": 1,
          "nickname": "mortiz-d"
        }
      },
      {
        "id": 5,
        "content": "¡Hola, cómo estás!",
        "created_at": "2023-11-27T21:00:00.000Z",
        "sender": {
          "id": 1,
          "nickname": "mortiz-d"
        },
        "receiver": {
          "id": 3,
          "nickname": "aborbol"
        }
      },
      {
        "id": 6,
        "content": "Hola, estoy bien. ¿Y tú?",
        "created_at": "2023-11-27T21:05:00.000Z",
        "sender": {
          "id": 3,
          "nickname": "aborbol"
        },
        "receiver": {
          "id": 1,
          "nickname": "mortiz-d"
        }
      },
      {
        "id": 7,
        "content": "Hola, ¿qué tal?",
        "created_at": "2023-11-27T22:00:00.000Z",
        "sender": {
          "id": 1,
          "nickname": "mortiz-d"
        },
        "receiver": {
          "id": 4,
          "nickname": "josuna"
        }
      },
      {
        "id": 8,
        "content": "Bien, gracias. ¿Y tú?",
        "created_at": "2023-11-27T22:05:00.000Z",
        "sender": {
          "id": 4,
          "nickname": "josuna"
        },
        "receiver": {
          "id": 1,
          "nickname": "mortiz-d"
        }
      },
      {
        "id": 9,
        "content": "Hola, ¿cómo estás?",
        "created_at": "2023-11-27T23:00:00.000Z",
        "sender": {
          "id": 1,
          "nickname": "mortiz-d"
        },
        "receiver": {
          "id": 5,
          "nickname": "msantos-"
        }
      },
      {
        "id": 10,
        "content": "Hola, bien, gracias. ¿Y tú?",
        "created_at": "2023-11-27T23:05:00.000Z",
        "sender": {
          "id": 5,
          "nickname": "msantos-"
        },
        "receiver": {
          "id": 1,
          "nickname": "mortiz-d"
        }
      },
      {
        "id": 11,
        "content": "Hola, ¿qué hay?",
        "created_at": "2023-11-27T23:59:00.000Z",
        "sender": {
          "id": 1,
          "nickname": "mortiz-d"
        },
        "receiver": {
          "id": 6,
          "nickname": "mtacuna"
        }
      },
      {
        "id": 12,
        "content": "Hola, bien, gracias. ¿Y tú?",
        "created_at": "2023-11-28T00:05:00.000Z",
        "sender": {
          "id": 6,
          "nickname": "mtacuna"
        },
        "receiver": {
          "id": 1,
          "nickname": "mortiz-d"
        }
      }
]);

mock_user_list.set([
    {
        "id": 2,
        "nickname": "vicmarti",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/vicmarti.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    },
    {
        "id": 3,
        "nickname": "aborbol",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/aborbol.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    },
    {
        "id": 4,
        "nickname": "josuna",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/josuna.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    },
    {
        "id": 5,
        "nickname": "msantos-",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/msantos-.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    },
    {
        "id": 6,
        "nickname": "mtacuna",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/mtacuna.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    },
    {
        "id": 7,
        "nickname": "samoreno",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/samoreno.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    },
    {
        "id": 8,
        "nickname": "priezu-m",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/priezu-m.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    },
    {
        "id": 9,
        "nickname": "afelicia",
        "isRegistered": false,
        "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/afelicia.jpg",
        "two_factor_auth_secret": " ",
        "two_factor_auth_enabled": false
    }
]
);

mock_channels.set([
  {
    "id": 1,
    "nickname": "El Grupaso",
    "description": "Este canal es de prueba",
    "password": "",
    "created_at": "2023-11-28T03:23:37.913Z",
    "messages": [
        {
            "id": 1,
            "content": "Hola :)",
            "created_at": "2023-11-28T03:25:38.149Z",
            "sender": {
                "id": 1,
                "nickname": "mortiz-d",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        },
        {
            "id": 4,
            "content": "Hey!",
            "created_at": "2023-11-28T03:26:11.892Z",
            "sender": {
                "id": 2,
                "nickname": "vicmarti",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/vicmarti.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        },
        {
            "id": 5,
            "content": "saludos",
            "created_at": "2023-11-28T03:26:21.665Z",
            "sender": {
                "id": 3,
                "nickname": "aborbol",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/aborbol.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        }
    ],
    "members": [
        {
            "id": 1,
            "nickname": "mortiz-d",
            "email": null,
            "avatar": "https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg",
            "two_factor_auth_secret": null,
            "two_factor_auth_enabled": false
        },
        {
            "id": 2,
            "nickname": "vicmarti",
            "email": null,
            "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/vicmarti.jpg",
            "two_factor_auth_secret": null,
            "two_factor_auth_enabled": false
        },
        {
            "id": 3,
            "nickname": "aborbol",
            "email": null,
            "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/aborbol.jpg",
            "two_factor_auth_secret": null,
            "two_factor_auth_enabled": false
        }
    ]
},
{
    "id": 2,
    "nickname": "El gran Grupo",
    "description": "Este canal es de prueba",
    "password": "",
    "created_at": "2023-11-28T03:23:50.021Z",
    "messages": [
        {
            "id": 2,
            "content": "Hola :(",
            "created_at": "2023-11-28T03:25:49.555Z",
            "sender": {
                "id": 1,
                "nickname": "mortiz-d",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        },
        {
            "id": 6,
            "content": "No eres bienvenido",
            "created_at": "2023-11-28T03:26:58.771Z",
            "sender": {
                "id": 4,
                "nickname": "josuna",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/josuna.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        },
        {
            "id": 7,
            "content": "Largate",
            "created_at": "2023-11-28T03:27:13.518Z",
            "sender": {
                "id": 5,
                "nickname": "msantos-",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/msantos-.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        }
    ],
    "members": [
        {
            "id": 1,
            "nickname": "mortiz-d",
            "email": null,
            "avatar": "https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg",
            "two_factor_auth_secret": null,
            "two_factor_auth_enabled": false
        },
        {
            "id": 4,
            "nickname": "josuna",
            "email": null,
            "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/josuna.jpg",
            "two_factor_auth_secret": null,
            "two_factor_auth_enabled": false
        },
        {
            "id": 5,
            "nickname": "msantos-",
            "email": null,
            "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/msantos-.jpg",
            "two_factor_auth_secret": null,
            "two_factor_auth_enabled": false
        }
    ]
},
{
    "id": 3,
    "nickname": "La tercera Ronda",
    "description": "Este canal es de prueba",
    "password": "",
    "created_at": "2023-11-28T03:24:08.684Z",
    "messages": [
        {
            "id": 3,
            "content": "Hola :l",
            "created_at": "2023-11-28T03:25:57.293Z",
            "sender": {
                "id": 1,
                "nickname": "mortiz-d",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        },
        {
            "id": 8,
            "content": "Este era el sitio para llorar no?",
            "created_at": "2023-11-28T03:27:28.747Z",
            "sender": {
                "id": 8,
                "nickname": "priezu-m",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/priezu-m.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        },
        {
            "id": 9,
            "content": "Si .... :,l",
            "created_at": "2023-11-28T03:27:41.764Z",
            "sender": {
                "id": 9,
                "nickname": "afelicia",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/afelicia.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        },
        {
            "id": 10,
            "content": "Que depresivo todo :v",
            "created_at": "2023-11-28T03:28:01.066Z",
            "sender": {
                "id": 1,
                "nickname": "mortiz-d",
                "email": null,
                "avatar": "https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg",
                "two_factor_auth_secret": null,
                "two_factor_auth_enabled": false
            }
        }
    ],
    "members": [
        {
            "id": 1,
            "nickname": "mortiz-d",
            "email": null,
            "avatar": "https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg",
            "two_factor_auth_secret": null,
            "two_factor_auth_enabled": false
        },
        {
            "id": 9,
            "nickname": "afelicia",
            "email": null,
            "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/afelicia.jpg",
            "two_factor_auth_secret": null,
            "two_factor_auth_enabled": false
        },
        {
            "id": 8,
            "nickname": "priezu-m",
            "email": null,
            "avatar": "https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/priezu-m.jpg",
            "two_factor_auth_secret": null,
            "two_factor_auth_enabled": false
        }
    ]
}
]);