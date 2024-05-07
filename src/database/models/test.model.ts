import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';


export type ITestAttribute = InferAttributes<TestModel>;

@Table({
  tableName: 'test',
  paranoid: false,
})
export class TestModel extends Model<
  ITestAttribute,
  InferCreationAttributes<TestModel>
> {
  @PrimaryKey
  @Column
  userId: string;

  @PrimaryKey
  @Column({ type: DataTypes.UUID })
  communityId: string;

  @Column({ type: DataTypes.NUMBER, allowNull: false, defaultValue: 0 })
  point: number;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;

}
