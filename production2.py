#from pandas.hashtable import na_sentinel

import hlt
from hlt import NORTH, EAST, SOUTH, WEST, STILL, Move, Square
import random
import logging
import csv
from collections import namedtuple

# prodWeight= random.randint(1,10)
# squareWeight= random.randint(1,10)
# stayStill = random.randint(3,7)
# gameStyle = random.randint(0,1)

stayStill = 5
gameStyle = 1
beingAttacked = False

myID, game_map, targetCoord,totalStrength,totalProd,areaStrength,ts,tp,sd = hlt.get_init(1,2)
hlt.send_init("ProductionBevster")

#logging.basicConfig(filename=str("game_in") + '.log', level=logging.DEBUG)


def find_best_direction(square):
    direction = NORTH
    direction2 = NORTH
    max_distance = min(game_map.width, game_map.height) / 2
    max_unoccup = min(game_map.width, game_map.height) / 2
    max_prod = 0
    for d in (NORTH, EAST, SOUTH, WEST):
        distance = 0
        current = square
        unoccup_count = 0
        prod_sum = 0
        while (current.owner==myID or current.owner==0) and distance < max_distance:
            distance += 1
            if current.owner==0:
                unoccup_count+=1
                prod_sum+=(square.production)/tp -  (square.strength)/ts

            current = game_map.get_target(current, d)

        if prod_sum>max_prod:
            max_prod = prod_sum
            direction = d

        if distance < max_distance:
            direction2 = d
            max_distance = distance

        if unoccup_count < max_unoccup:
            max_unoccup=unoccup_count

        #if unoccup_count<1000:
    return direction,direction2,max_distance


def distProdRatio():
    None

def heuristic(square,prodWeight,squareWeight):
    if square.owner == 0 and square.strength > 0:
        return (prodWeight*square.production) / (squareWeight*square.strength)
    else:
        # return total potential damage caused by overkill when attacking this square
        return sum(neighbor.strength for neighbor in game_map.neighbors(square) if neighbor.owner not in (0, myID))

def heuristic2(square):
    if square.owner == 0 and square.strength > 0:
        return (square.production)/tp -  (square.strength)/ts
        #return (square.production*square.production) / (square.strength)
    else:
        # return total potential damage caused by overkill when attacking this square
        return sum(neighbor.strength for neighbor in game_map.neighbors(square) if neighbor.owner not in (0, myID))

# def find_high_prod(square):
#     max_prod = square.production
#     direction = 0
#     if square.strength>1:
#         for d in (NORTH, EAST, SOUTH, WEST):
#             target = game_map.get_target(square, d)
#             if target.production > max_prod:
#                 max_prod = target.production
#                 direction = d
#     return direction

def get_move(square):
    target, direction = max(((neighbor, direction) for direction, neighbor in enumerate(game_map.neighbors(square))
                             if neighbor.owner != myID),
                            default=(None, None),
                            key=lambda t: heuristic2(t[0]))


    if target is not None and target.strength < square.strength:
        return Move(square, direction)
    elif square.strength < square.production * stayStill: #and square.strength<100
        return Move(square, STILL)

    border = any(neighbor.owner != myID for neighbor in game_map.neighbors(square))
    if not border:
        # if square.strength < square.production * stayStill:
        #     direction = find_high_prod(square)
        #     return Move(square, direction)
        # else:
        direction, direction2, distance = find_best_direction(square)

        if distance < 5:
            #None
            global beingAttacked
            beingAttacked=True

        #logging.debug(str(beingAttacked) + " "+ str(distance))
        if beingAttacked == True:
            dir = direction2
        else:
            dir = direction

        return Move(square,dir)
    else:
        # wait until we are strong enough to attack
        return Move(square, STILL)


def get_xydistance(self, sq1, sq2):
        "Returns Manhattan distance between two squares."
        dx = min(abs(sq1.x - sq2.x), sq1.x + self.width - sq2.x, sq2.x + self.width - sq1.x)
        dy = min(abs(sq1.y - sq2.y), sq1.y + self.height - sq2.y, sq2.y + self.height - sq1.y)
        return dx,dy

def find_nearest_dense(square,targetCoord):

    direc = NORTH
    lrDist = targetCoord.x- square.x

    lrFlip = False
    if abs(lrDist)>game_map.width/2:
        lrFlip = True

    if lrDist !=0:
        if lrFlip:
            if (lrDist) > 0:
                neighbour = game_map.get_target(square, WEST)
                direc = WEST
            else:
                neighbour = game_map.get_target(square, EAST)
                direc = EAST
        else:
            if (lrDist)>0:
                neighbour = game_map.get_target(square, EAST)
                direc = EAST
            else:
                neighbour = game_map.get_target(square, WEST)
                direc = WEST
        maxStrength = neighbour.strength
    else:
        maxStrength = 10000

    udDist = targetCoord.y - square.y

    udFlip = False
    if abs(udDist)>game_map.height/2:
        udFlip = True

    if udDist != 0:
        if udFlip:
            if (udDist) < 0:
                neighbour = game_map.get_target(square, SOUTH)
                if neighbour.strength<maxStrength:
                    direc = SOUTH
            else:
                neighbour = game_map.get_target(square, NORTH)
                if neighbour.strength<maxStrength:
                    direc = NORTH
        else:
            if (udDist) < 0:
                neighbour = game_map.get_target(square, NORTH)
                if neighbour.strength<maxStrength:
                    direc = NORTH
            else:
                neighbour = game_map.get_target(square, SOUTH)
                if neighbour.strength<maxStrength:
                    direc = SOUTH

    #logging.debug(str(direc) + " " + str(square) + " " + str(targetCoord))

    neighbour = game_map.get_target(square, direc)
    if neighbour.strength < square.strength and neighbour.owner==0:
        return Move(square, direc)
    elif neighbour.owner == myID and square.strength > square.production * 5:
        return Move(square, direc)
    else:# square.strength < square.production * 5: #and square.strength<100
        return Move(square, STILL)

if gameStyle == 1:
    target = False
else:
    target = True

# logging.debug(str(prodWeight) + " " + str(squareWeight) + " " + str(stayStill) + " " +str(game_map.height) + " " + str(gameStyle)
#                   + " " + str(totalStrength) + " " + str(totalProd) + " " + str(areaStrength) + " " + str(game_map.starting_player_count)
#           )


# csvFile = csv.writer(open('\\\\ldnvnascti0037\\FXT_Grail$\\bevan\\halite.csv', "w", newline=''))
# csvFile2 = csv.writer(open('\\\\ldnvnascti0037\\FXT_Grail$\\bevan\\halite2.csv', "w", newline=''))
# count = 0
# row = []
# row2 = []
# for square in game_map:
#
#     row.append(square.production)
#     row2.append(square.strength)
#
#     count += 1
#     if count==29:
#         csvFile.writerow(row)
#         csvFile2.writerow(row2)
#         row = []
#         row2 = []
#         count = 0



    #logging.debug(str(square.x) + "," + str(square.y) + ","+ str(square.production) + "," +str(square.strength))

# num_players = game_map.starting_player_count
# area =game_map.width*game_map.height
# area_count = []
# turn_count = 0
#
# if square.owner != 0:
#     area_count[square.owner] += 1
#
#     for i in num_players:
#         area_count.append(0)

while True:
    game_map.get_frame()

    if target==False:

        if random.uniform(0, 1)<=1:

            moves = [find_nearest_dense(square,targetCoord) for square in game_map if square.owner == myID]
            for square in game_map:
                if square.x==targetCoord.x and square.y==targetCoord.y and square.owner!=0:
                    target = True
                    #logging.debug(target)
            hlt.send_frame(moves)

        else:
            moves = [get_move(square) for square in game_map if square.owner == myID]
            hlt.send_frame(moves)

    else:
        moves = [get_move(square) for square in game_map if square.owner == myID]
        hlt.send_frame(moves)

        # if target.production*4 >= square.production*5:
        #     direction = direction
        # elif square.strength>square.production*5:
        #     direction = direction
        # else:
        #     direction = 0

        # if square.strength + target.strength > 255:
        #     direction = 0


