-- Creating Users table.
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
	firstName VARCHAR(50) NOT NULL,
	lastName VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Creating Favourites table.
CREATE TABLE Favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES Movies(movie_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating Reviews table.
CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    movie_id INT REFERENCES Movies(movie_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating Groups table.
CREATE TABLE Groups (
    group_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255),
    CONSTRAINT fk_owner_email FOREIGN KEY (owner_email) REFERENCES Users(email) ON DELETE CASCADE
);


-- Add trigger function to automatically insert owner as a member when a group is created
CREATE OR REPLACE FUNCTION add_owner_to_group_members()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO GroupMembers (group_id, user_id, is_owner, status)
    VALUES (NEW.group_id, NEW.owner_id, TRUE, 'accepted');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger on Groups table to automatically insert owner as an admin when a group is created
CREATE TRIGGER after_group_creation
AFTER INSERT ON Groups
FOR EACH ROW
EXECUTE FUNCTION add_owner_to_group_members();

-- Creating enum type for status column in GroupMembers table.
CREATE TYPE status_enum AS ENUM ('pending', 'accepted', 'rejected');

-- Creating GroupMembers table.
CREATE TABLE GroupMembers (
    group_member_id SERIAL PRIMARY KEY,
    group_id INT REFERENCES Groups(group_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    is_owner BOOLEAN DEFAULT FALSE,
    status status_enum DEFAULT 'pending',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating enum type for status column in group_requests table.
CREATE TYPE status_enum2 AS ENUM ('pending', 'approved', 'rejected');

-- Creating group_requests table.
CREATE TABLE group_requests (
    group_request_id SERIAL PRIMARY KEY,
    group_id INT REFERENCES Groups(group_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    status status_enum2 DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);