CREATE TABLE Users (
  id serial primary key,
  firstName varchar(100),
  lastName varchar(100),
  email varchar(200) unique not null,
  created_at bigint not null,
  status boolean default false,
  amount integer,
  walletAddress varchar(42)
)