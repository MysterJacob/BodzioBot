# MANUAL
##### https://github.com/MysterJacob/BodzioBot/blob/main/BASICS.md
## Commands
Commands in this bot are indicated by prefix (default **-**)
Commands can have parameters and flags

## Parameters
Parameters are positional arguments f.e.
-card [USER]
To list all parameters for command, **help** can
be used, typing **help** is going to display all categories
and typing **help [CATEGORY]** will display all commands in
category.

Parameters in help are displayed like NAME:TYPE
if parameter has **?** At the start,
then it's optional (has default value)

If you want to specify argument containing space
user **"** then.

###### Parameters Type
- STRING - Just a normal text
- NUMBER - Just a number
- MEMBER - Guild member, can be specified as **Mention**(@Myster), **ID**(330768055468818435), **Nickname, Username**(Myster), **Discriminator**(7218)
- ROLE - Guild role, can be specified as **Mention**(@Moderator), **ID**(330768055468818435), **Name**(Moderator)
- CHANNEL - Guild channel, can be specified as **Mention**(#links), **ID**(330768055468818435), **Name**(links)
- DATE - Date in format like **dd/mm/yyyy** or **dd.mm.yyyy**
- Hour - Hour in format like **hh/mm/ss**, note that seconds are optional.
- Time - Time in format like **hh/mm/ss**, note that seconds are optional.

## Flags
Flags are like parameters, but they don't have static position.
They are indicated by **-** or **/**
You can use them like this:
-card [USER] -p
or like this:
-card -p [USER]
It doesn't matter where the flag is placed

Flags have the same types as parameters, but
there is one more type **bool**.
Bool is type of flag indicating something
like -p in command **card** "tells" the command
to display permissions, it doesn't get any parameters.

If a flag has another type than **boolean**, then you have to
specifie the 'parameter' of this flag, like:

-timer [TIMER] -n [NAME]

In this case the timer will be named [NAME]

Important if you want to specifie parameter
starting with **-** , like when you try to change prefix:

-settings prefix -
The bot will throw an error:

Error occurred while parsing your command:
Undefined flag ````
*settings prefix -

If you don't want **-** or **-** to be seen
by bot just add \ before them, like:

-settings prefix \\-

Then bot won't throw an error.

Any time soon there will be a command guide.