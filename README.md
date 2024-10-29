
# Foodiefind-api  ☸️☸️
<h1 align="center"> Final Capstone Project: Foodiefind-api</h1> <br>


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Topics Covered
|   |   |   |
| ------------ | ------------ | ------------ |
|  NodeJS | Express  |  Knex |
| MySQL | JWT- authentication | API-endpoints |




## Endpoints  
*Recipes:*  

**GET /recipes?page=<optional||number>&limit=<optional||number>**
```
[
{
"page": 1,
    "limit": 10,
    "totalRows": 1270000,
    "totalPages": 127000,
    "recipes": [
        {
            "id": 1,
            "title": "No-Bake Nut Cookies",
            "ner": [
                "bite size shredded rice biscuits",
                "vanilla",
                "brown sugar",
                "nuts",
                "milk",
                "butter"
            ],
            "directions": [
                "In a heavy 2-quart saucepan, mix brown sugar, nuts, evaporated milk and butter or margarine.",
                "Stir over medium heat until mixture bubbles all over top.",
                "Boil and stir 5 minutes more. Take off heat.",
                "Stir in vanilla and cereal; mix well.",
                "Using 2 teaspoons, drop and shape into 30 clusters on wax paper.",
                "Let stand until firm, about 30 minutes."
            ]
        },.....]

}
]
```

**GET /recipes/search?s=butter chick**
```
[
    {
        "id": 1024686,
        "title": "Butter Chicken",
        "ner": "[\"black pepper\", \"eggs\", \"buttery round crackers\", \"butter\", \"garlic\", \"chicken\"]",
        "directions": "[\"Preheat the oven to 190*C/375*F/Gas mark5.\", \"Place the eggs into a shallow bowl.\", \"Place the crackercrumbs into another shallow bowl and mix together with the garlic powder and the pepper.\", \"Dip the chicken breasts, first into the egg and then roll them in the cracker crumb mixture, coating them well.\", \"Place them in a 9 by 13 inch baking dish.\", \"Drop the pieces of butter all around the pieces of the chicken.\", \"Bake for 30 to 35 minutes in the preheated oven until the chicken is no longer pink inside, the juices run clear and the crumbs are nicely browned.\"]"
    },
    {
        "id": 1067671,
        "title": "Butter Chicken",
        "ner": "[\"ginger-garlic\", \"ginger paste\", \"lemon juice\", \"honey\", \"chili powder\", \"yoghurt\", \"water\", \"sauce\", \"fenugreek leaves\", \"fresh heavy cream\", \"garam masala\", \"tomato puree\", \"green chili pepper\", \"butter\", \"garlic\", \"chicken\", \"olive oil\", \"salt\"]",
        "directions": "[\"To Marinate: Place the chicken in a non-porous glass dish or bowl with lemon juice, 1 tbsp chilli powder and salt.\", \"Toss to coat.\", \"Cover the dish and refrigerate to marinate for an hour.\", \"Drain yoghurt in a cloth for 15-20 minutes.\", \"Place yoghurt in a medium bowl.\", \"Add salt, garlic paste, garam ....]"
    },
....
]
```
**GET /recipes/ingredients?s=salt**
```
[
    {
        "id": 4706,
        "name": "salt"
    },
    {
        "id": 10010110,
        "name": "salt/"
    }, ...
]
```

**GET /recipes/11342**  
res:
```
[
    {
        "id": 11342,
        "title": "Cherry Torte",
        "ingredients": "[\"1 1/4 c. granulated sugar\", \"1 c. flour\", \"1 tsp. soda\", \"1 tsp. cinnamon\", \"1/4 tsp. salt\", \"1 Tbsp. melted butter\", \"1 beaten egg\", \"1 can drained sour cherries, drain and save juice\", \"1/2 c. nut meats\"]",
        "directions": [
            "Combine ingredients in order given except use only 1/2 can cherries.",
            "Lastly, fold in last 1/2 of cherries.",
            "Bake 45 minutes at 350°."
        ],
        "link": "www.cookbooks.com/Recipe-Details.aspx?id=769001",
        "source": "Gathered",
        "site": "www.cookbooks.com",
        "ner": [
            "egg",
            "sugar",
            "nut meats",
            "cinnamon",
            "soda",
            "flour",
            "sour cherries",
            "butter",
            "salt"
        ]
    }
]
```

**POST /recipes/ingredients**
req: json  
```

{
    "ingredients": [5210,8976,234,678,68,123,5443,4701]
}

```
res:
```
{
    "currentPage": 0,
    "recipes": [
        {
            "title": "Caramel Sheet Cake",
            "id": 11173,
            "directions": [
                "Mix according to directions on box.",
                "Prepare a 13 x 9-inch and a small square pan by greasing pans and sprinkling with powdered sugar.",
                "Bake according to box directions.",
                "Cool in pans and spread frosting on tops."
            ]
        },
        {
            "title": "Boudain Dip",
            "id": 12309,
            "directions": [
                "Skin boudain and cut into slices. Microwave for 30 to 45 seconds to soften."
            ]
        },
        {
            "title": "Mud Puddles",
            "id": 37962,
            "directions": [
                "Prepare or buy your favorite chocolate chip cookie dough."
            ]
        },...
]
}
```

*Users:*  
**POST /users/register**  
**POST /users/verify** 

**GET /users/user**  

**POST /users/like**  
**GET /users/like/3**    
**DELETE /users/like/3**

**GET /users/recipes**  

**GET /users/ingredients**  
**PUT /users/ingredients**  
**POST /users/ingredients**  
**DELETE /users/ingredients**  







## Configuration and Important instructions

DATABASE-NAME: foodiefind    

⌨️⌨️
**IMPORTANT:**  

No seeding and migrations, Database dump file available upon request.
.env file sample:  
``` 
JWT_SECRET_KEY=sdfsderwer
PORT=8080
BACKEND_URL=http://localhost:


DB_HOST=127.0.0.1
DB_NAME=foodiefind
DB_USER=root
DB_PASSWORD=rootroot
DB_PORT=3306 
```

In my.ini(mysql config file) file if required modify:  
```
[mysqld]  
innodb_buffer_pool_size = 2G  
sort_buffer_size = 4M  # or a higher value, like 8M or 16M

```
*
**VS Code** for the coding environment  
🤳🤳

**VScode Extensions: ** live SASS compiler, live server, Emmet, px to rem & rpx & vw <br>





## Contact information

💚💚
Feel free to send me feedback on my email, tanwarkeerat@gmail.com.


## Acknowledgments
😇😇
**Thanks to Brainstation for upgrading my skills and thanks to everyone who viewed my repo.**

