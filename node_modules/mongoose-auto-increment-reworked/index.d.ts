/// <reference types="mongoose" />
import { Schema } from 'mongoose';
/** Function for getting the next counter value */
export declare type NextCountFunction = () => Promise<number>;
/** Function for resetting the current counter value */
export declare type ResetCountFunction = NextCountFunction;
/** Plugin configuration */
export interface PluginOptions {
    /**
     * The field that will be automatically incremented. Do not define this in your schema.
     * @default _id
     */
    field: string;
    /**
     * How much every insert should increment the counter by
     * @default 1
     */
    incrementBy: number;
    /**
     * The name of the function for getting the next ID number.
     * Set this to false to prevent the function from being added to the schema's static and instance methods.
     * @default _nextCount
     */
    nextCount: string | false;
    /**
     * The name of the function for resetting the ID number
     * Set this to false to prevent the function from being added to the schema's static and instance methods.
     * @default _resetCount
     */
    resetCount: string | false;
    /**
     * The first number that will be generated
     * @default 1
     */
    startAt: number;
    /**
     * Whether or not to add a unique index on the field. This option is ignored if the field name is _id.
     * @default true
     */
    unique: boolean;
}
/** Plugin options when applying via schema.plugin() */
export interface SchemaPluginOptions extends Partial<PluginOptions> {
    modelName: string;
}
/** Mongoose plugin for automatically generating auto-incrementing IDs */
export declare class MongooseAutoIncrementID {
    /** Name of the model used by the plugin */
    private static modelName;
    /** User-provided options */
    private readonly _options;
    /** Name of the model we're working with */
    private readonly model;
    /** Schema to apply the plugin to. */
    private readonly schema;
    /**
     * Create a new plugin instance
     * @param schema Schema to apply the plugin to. Must be an instance of Mongoose Schema
     * @param modelName Name of the model that this schema will use.
     * @param options Plugin configuration
     * @throws {TypeError} If schema is not given or is not an instance of Mongoose Schema
     * @throws {TypeError} If modelName is not given or is not a string
     */
    constructor(schema: Schema, modelName: string, options?: Partial<PluginOptions>);
    /** The model instance */
    private static readonly idCounter;
    /** Error, if any, thrown by applyPlugin() */
    readonly error: Error | undefined;
    /** Whether or not the initialisation has completed */
    readonly isReady: boolean;
    /** Promise returned by applyPlugin() */
    readonly promise: Promise<void>;
    /** Default arguments for querying the id counter collection */
    private readonly findArgs;
    /** The initial counter value */
    private readonly initialStart;
    /** User-supplied options merged with defaults */
    private readonly options;
    /** The plugin instante's ready state */
    private readonly state;
    /** The default options used by the plugin */
    static getDefaults(): PluginOptions;
    /**
     * Get the initialisation error for the given schema and model
     * @param schema The schema
     * @param modelName The mode
     * @returns The initialisation error that occurred or undefined if the schema/model combination hasn't been plugged
     *   into yet or hasn't errored.
     */
    static getErrorFor(schema: Schema, modelName: string): Error | undefined;
    /**
     * Get the initialisation promise for the given schema and model
     * @param schema The schema
     * @param modelName The mode
     * @returns The initialisation promise or undefined if the schema/model combination hasn't been plugged into yet.
     */
    static getPromiseFor(schema: Schema, modelName: string): Promise<void> | undefined;
    /**
     * Set the model name this plugin will use. Has no effect if you have already applied the plugin to a schema.
     * @param modelName Name of the plugin model
     * @throws {TypeError} If model name is not a string. Won't happen if you omit the parameter.
     */
    static initialise(modelName?: string): void;
    /**
     * Check if the given schema and model have finished their plugin initialisation
     * @param schema The schema
     * @param modelName The mode
     * @returns true if the initialisation completed successfully, false if it hasn't completed yet, it errored or hasn't
     *   started yet.
     */
    static isReady(schema: Schema, modelName: string): boolean;
    /**
     * Handler for applying the plugin via schema.plugin()
     * @param schema The schema we're applying the plugin to
     * @param options Plugin options. This should be a {@link SchemaPluginOptions} object containing a modelName key and,
     * optionally, any of the other plugin options.
     */
    static plugin(schema: Schema, options?: any): Promise<void>;
    /**
     * Set default options used by the plugin
     * @param newOpts The options
     * @throws If any parameter is invalid
     */
    static setDefaults(newOpts?: Partial<PluginOptions>): void;
    /**
     * Internal static state getter
     * @param schema Schema we're getting the state for
     * @param modelName Model we're getting the state for
     * @returns The ready state or undefined if the state cannot be found
     */
    private static getStateFor(schema, modelName);
    /**
     * Validates the options supplied by the user
     * @param options The options to validate
     * @throws {TypeError} if a validation fails
     */
    private static validateOptions(options);
    /**
     * Apply the plugin to the given schema
     * @returns A void promise that resolves when the initialisation has completed. You do not need to wait for the
     *   promise to resolve - any document insertion queries will be queued until the initialisation completes. You
     *   should, however, catch any errors if this promise rejects.
     */
    applyPlugin(): Promise<void>;
    /**
     * Validates the options supplied by the user
     * @throws {TypeError} if a validation fails
     */
    validateOptions(): void;
    /** Add the field containing our auto-incremented ID to the schema definition */
    private addFieldToSchema();
    /** Add the next count function if enabled */
    private addNextCount();
    /** Add the pre-save hook to the schema that will generate our IDs */
    private addPreSave();
    /** Add the reset count function if enabled */
    private addResetCount();
    /** Initialise the counter for this schema */
    private init();
    /** Generate the next ID, update counter document, return ID */
    private onSaveAnyField();
    /** Synchronise the ID provided in the document with the database value */
    private onSaveNumberField(value);
}
