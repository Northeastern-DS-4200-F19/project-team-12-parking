import pandas as pd

df = pd.read_table("1_survey_data.csv", sep=",")

def unique_zone(row):
    return str(row[1]) + str(row[2])

def _sparse_cars(row):
    return row[6:21]

def _is_car(name):
        return isinstance(name, str) and len(name) == 3

def dense_cars(row):
    return (item for item in _sparse_cars(row) if _is_car(item))

def percent_of_time_occupied(row):
    return len(list(dense_cars(row))) / (21 - 6)

def number_of_unique_cars(row):
    return len(set(dense_cars(row)))

def parking_intervals(row):
    sparse_list = [_is_car(item) for item in _sparse_cars(row)]


def new_data(row):
    return pd.Series({'unique_zone': unique_zone(row), 
                      'percent_of_time_occupied': percent_of_time_occupied(row), 
                      'number_of_unique_cars': number_of_unique_cars(row)})

new_df = df.apply(new_data, axis=1)

times_df = df.loc[:, "6:00 AM":"8:00 PM"].applymap(lambda s: str(_is_car(s)).lower())

def renamer(s):
    hour = s.split(':')[0]
    am_pm = s.split()[-1]
    return (hour + am_pm).lower()

newest_df = pd.concat([times_df.rename(mapper=renamer, axis=1), new_df], axis=1, sort=False).rename_axis('spot_number')
gnewest_df.to_csv('2_survey_data.csv', index=True, )
